export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Comments: {
        Row: {
          comment_id: number
          created_at: string
          project_id: number | null
          user_id: string
        }
        Insert: {
          comment_id?: number
          created_at?: string
          project_id?: number | null
          user_id: string
        }
        Update: {
          comment_id?: number
          created_at?: string
          project_id?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Comments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "Project"
            referencedColumns: ["project_id"]
          }
        ]
      }
      Followers: {
        Row: {
          followers_id: string
          user_id: string
        }
        Insert: {
          followers_id: string
          user_id: string
        }
        Update: {
          followers_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Followers_followers_id_fkey"
            columns: ["followers_id"]
            isOneToOne: false
            referencedRelation: "Profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Followers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "Profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      Likes: {
        Row: {
          created_at: string
          like_id: number
          project_id: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          like_id?: number
          project_id?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          like_id?: number
          project_id?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Likes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "Project"
            referencedColumns: ["project_id"]
          }
        ]
      }
      Patterns: {
        Row: {
          author_name: string | null
          pattern_id: number
          pattern_name: string | null
          project_id: number | null
          yarn_id: number | null
        }
        Insert: {
          author_name?: string | null
          pattern_id?: number
          pattern_name?: string | null
          project_id?: number | null
          yarn_id?: number | null
        }
        Update: {
          author_name?: string | null
          pattern_id?: number
          pattern_name?: string | null
          project_id?: number | null
          yarn_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Patterns_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "Project"
            referencedColumns: ["project_id"]
          },
          {
            foreignKeyName: "Patterns_yarn_id_fkey"
            columns: ["yarn_id"]
            isOneToOne: false
            referencedRelation: "Yarn"
            referencedColumns: ["yarn_id"]
          }
        ]
      }
      Profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          birthday: string | null
          email: string | null
          follower_count: number | null
          following_count: number | null
          full_name: string
          id: string
          initialized: boolean | null
          project_count: number
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          birthday?: string | null
          email?: string | null
          follower_count?: number | null
          following_count?: number | null
          full_name: string
          id: string
          initialized?: boolean | null
          project_count?: number
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          birthday?: string | null
          email?: string | null
          follower_count?: number | null
          following_count?: number | null
          full_name?: string
          id?: string
          initialized?: boolean | null
          project_count?: number
          username?: string | null
        }
        Relationships: []
      }
      Project: {
        Row: {
          created_at: string
          description: string | null
          difficulty: string | null
          images: string[]
          needle_size: string
          pattern: string | null
          project_id: number
          status: string
          tags: string[] | null
          time_spent: number | null
          title: string
          user_id: string
          yarn: string[] | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          difficulty?: string | null
          images: string[]
          needle_size: string
          pattern?: string | null
          project_id?: number
          status: string
          tags?: string[] | null
          time_spent?: number | null
          title: string
          user_id: string
          yarn?: string[] | null
        }
        Update: {
          created_at?: string
          description?: string | null
          difficulty?: string | null
          images?: string[]
          needle_size?: string
          pattern?: string | null
          project_id?: number
          status?: string
          tags?: string[] | null
          time_spent?: number | null
          title?: string
          user_id?: string
          yarn?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "Project_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "Profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      Yarn: {
        Row: {
          colour: string | null
          gauge: string | null
          material: string | null
          yardage: number | null
          yarn_id: number
          yarn_name: string | null
        }
        Insert: {
          colour?: string | null
          gauge?: string | null
          material?: string | null
          yardage?: number | null
          yarn_id?: number
          yarn_name?: string | null
        }
        Update: {
          colour?: string | null
          gauge?: string | null
          material?: string | null
          yardage?: number | null
          yarn_id?: number
          yarn_name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never
