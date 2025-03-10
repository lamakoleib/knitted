import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const supabaseUrl = Deno.env.get("SUPABASE_URL") || ""
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const QUEUE_NAME = "profile_events"

Deno.serve(async (req) => {
  try {
    const isScheduled = req.headers.get("x-scheduled") === "true"

    const processedCount = await processMessageBatch()

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${processedCount} messages from queue`,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    )
  } catch (error) {
    console.error("Error processing queue:", error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
})

async function processMessageBatch(batchSize = 10) {
  let processedCount = 0

  const { data: messages, error } = await supabase
    .schema("pgmq_public")
    .rpc("pop", {
      queue_name: QUEUE_NAME,
      count: batchSize,
    })

  if (error) {
    console.error("Error reading from queue:", error)
    return processedCount
  }

  if (!messages || messages.length === 0) {
    console.log("No messages in queue")
    return processedCount
  }

  for (const message of messages) {
    try {
      const { id, message: payload } = message

      if (!payload || typeof payload !== "object") {
        console.warn("Invalid message format:", payload)
        continue
      }

      const { action, data } = payload

      await processFollowAction(action, data)

      await supabase.schema("pgmq_public").rpc("archive", {
        queue_name: QUEUE_NAME,
        message_id: id,
      })

      processedCount++
    } catch (error) {
      console.error("Error processing message:", error)
    }
  }

  return processedCount
}

async function processFollowAction(action, data) {
  if (!data || !data.follower_id || !data.following_id) {
    throw new Error("Missing required data in payload")
  }

  const { follower_id, following_id } = data

  const { data: result, error } = await supabase.rpc("handle_follow_action", {
    p_action: action,
    p_follower_id: follower_id,
    p_following_id: following_id,
  })

  if (error) {
    throw new Error(`Transaction failed: ${error.message}`)
  }

  return result
}
