/**
 * @file /api/yarns GET route tests
 *
 * We mock NextResponse.json so it works in Jest's node env.
 * The handler only reads `req.url`, so we pass `{ url } as any` instead of a NextRequest.
 */

jest.mock("next/server", () => {
  return {
    NextResponse: {
      json: (body: any, init?: { status?: number }) => ({
        status: init?.status ?? 200,
        // mimic NextResponse#json() behavior used in tests
        json: async () => body,
      }),
    },
  };
});

import { GET } from "@/app/api/yarns/route";

const origEnv = { ...process.env };
const setAuthEnv = () => {
  process.env.RAVELRY_USERNAME = "user";
  process.env.RAVELRY_PASSWORD = "pass";
};
const clearAuthEnv = () => {
  delete process.env.RAVELRY_USERNAME;
  delete process.env.RAVELRY_PASSWORD;
};

describe("API /api/yarns GET", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.assign(process.env, origEnv);
  });

  afterEach(() => {
    Object.assign(process.env, origEnv);
  });

  const makeReq = (url: string) => ({ url } as any);

  it("returns 500 when auth env vars are missing", async () => {
    clearAuthEnv();
    // @ts-ignore
    global.fetch = jest.fn();

    const req = makeReq("http://example.com/api/yarns");
    const res = await GET(req);

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toMatch(/Missing RAVELRY_USERNAME\/RAVELRY_PASSWORD/);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("builds the Ravelry URL with mapped params and returns mapped results", async () => {
    setAuthEnv();

    const fakeResponse = {
      ok: true,
      json: async () => ({
        yarns: [
          {
            id: 10,
            name: "Rav Wool",
            yarn_company_name: "Rav Co",
            yarn_weight: { name: "DK" },
            yarn_fibers: [
              { fiber_type_name: "Merino Wool" },
              { fiber_type_name: "Nylon" },
            ],
            first_photo: { medium_url: "/m10.png" },
          },
          {
            id: 11,
            name: "NoPhoto Yarn",
            yarn_company_name: "Brandless",
            yarn_weight: { name: "Worsted" },
            yarn_fibers: [],
            first_photo: { medium_url: "/placeholder.svg" },
          },
        ],
      }),
    } as any;

    // @ts-ignore
    global.fetch = jest.fn().mockResolvedValue(fakeResponse);

    const req = makeReq(
      "http://example.com/api/yarns?q=alpaca&page=2&page_size=10&weight=dk&fiberc=merino&needles=4"
    );
    const res = await GET(req);

    // Assert outgoing fetch
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    const calledInit = (global.fetch as jest.Mock).mock.calls[0][1] as RequestInit;

    expect(calledUrl).toBe(
      "https://api.ravelry.com/yarns/search.json?query=alpaca&page=2&page_size=10&weight=dk&fiberc=merino&needles=4"
    );
    expect(calledInit?.headers).toMatchObject({
      Authorization: "Basic " + Buffer.from("user:pass").toString("base64"),
      Accept: "application/json",
    });

    expect(res.status).toBe(200);
    const body = await res.json();

    expect(body.page).toBe(2);
    expect(body.page_size).toBe(10);
    expect(body.results).toEqual([
      {
        id: "10",
        name: "Rav Wool",
        brand: "Rav Co",
        image: "/m10.png",
        weight: "DK",
        fibers: ["Merino", "Nylon"],
        colors: [],
        styles: [],
        price: undefined,
      },
      {
        id: "11",
        name: "NoPhoto Yarn",
        brand: "Brandless",
        image: "/placeholder.svg",
        weight: "Worsted",
        fibers: [],
        colors: [],
        styles: [],
        price: undefined,
      },
    ]);
  });

  it("passes through upstream errors (status & short body)", async () => {
    setAuthEnv();

    // @ts-ignore
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 502,
      text: async () => "Bad Gateway from Ravelry",
    });

    const req = makeReq("http://example.com/api/yarns?page_size=24");
    const res = await GET(req);

    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.error).toBe("Ravelry error 502");
    expect(body.body).toContain("Bad Gateway");
  });
});
