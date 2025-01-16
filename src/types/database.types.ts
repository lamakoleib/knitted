export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	public: {
		Tables: {
			Comments: {
				Row: {
					comment_id: number;
					created_at: string;
					project_id: number | null;
					user_id: string;
				};
				Insert: {
					comment_id?: number;
					created_at?: string;
					project_id?: number | null;
					user_id: string;
				};
				Update: {
					comment_id?: number;
					created_at?: string;
					project_id?: number | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "Comments_project_id_fkey";
						columns: ["project_id"];
						isOneToOne: false;
						referencedRelation: "Project";
						referencedColumns: ["project_id"];
					}
				];
			};
			Followers: {
				Row: {
					followers_id: string;
					user_id: string;
				};
				Insert: {
					followers_id: string;
					user_id: string;
				};
				Update: {
					followers_id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "Followers_followers_id_fkey";
						columns: ["followers_id"];
						isOneToOne: false;
						referencedRelation: "Profiles";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "Followers_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "Profiles";
						referencedColumns: ["user_id"];
					}
				];
			};
			Likes: {
				Row: {
					created_at: string;
					like_id: number;
					project_id: number | null;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					like_id?: number;
					project_id?: number | null;
					user_id: string;
				};
				Update: {
					created_at?: string;
					like_id?: number;
					project_id?: number | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "Likes_project_id_fkey";
						columns: ["project_id"];
						isOneToOne: false;
						referencedRelation: "Project";
						referencedColumns: ["project_id"];
					}
				];
			};
			Patterns: {
				Row: {
					author_name: string | null;
					pattern_id: number;
					pattern_name: string | null;
					project_id: number | null;
					yarn_id: number | null;
				};
				Insert: {
					author_name?: string | null;
					pattern_id?: number;
					pattern_name?: string | null;
					project_id?: number | null;
					yarn_id?: number | null;
				};
				Update: {
					author_name?: string | null;
					pattern_id?: number;
					pattern_name?: string | null;
					project_id?: number | null;
					yarn_id?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: "Patterns_project_id_fkey";
						columns: ["project_id"];
						isOneToOne: false;
						referencedRelation: "Project";
						referencedColumns: ["project_id"];
					},
					{
						foreignKeyName: "Patterns_yarn_id_fkey";
						columns: ["yarn_id"];
						isOneToOne: false;
						referencedRelation: "Yarn";
						referencedColumns: ["yarn_id"];
					}
				];
			};
			Profiles: {
				Row: {
					bio: string | null;
					first_name: string;
					follower_count: number | null;
					following_count: number | null;
					last_name: string;
					user_id: string;
					username: string;
				};
				Insert: {
					bio?: string | null;
					first_name: string;
					follower_count?: number | null;
					following_count?: number | null;
					last_name: string;
					user_id: string;
					username: string;
				};
				Update: {
					bio?: string | null;
					first_name?: string;
					follower_count?: number | null;
					following_count?: number | null;
					last_name?: string;
					user_id?: string;
					username?: string;
				};
				Relationships: [];
			};
			Project: {
				Row: {
					created_at: string;
					pattern_id: number | null;
					project_id: number;
					user_id: string;
					yarn_list: Json | null;
					yarrn_id: number | null;
				};
				Insert: {
					created_at?: string;
					pattern_id?: number | null;
					project_id?: number;
					user_id: string;
					yarn_list?: Json | null;
					yarrn_id?: number | null;
				};
				Update: {
					created_at?: string;
					pattern_id?: number | null;
					project_id?: number;
					user_id?: string;
					yarn_list?: Json | null;
					yarrn_id?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: "Project_pattern_id_fkey";
						columns: ["pattern_id"];
						isOneToOne: false;
						referencedRelation: "Patterns";
						referencedColumns: ["pattern_id"];
					},
					{
						foreignKeyName: "Project_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "Profiles";
						referencedColumns: ["user_id"];
					},
					{
						foreignKeyName: "Project_yarrn_id_fkey";
						columns: ["yarrn_id"];
						isOneToOne: false;
						referencedRelation: "Yarn";
						referencedColumns: ["yarn_id"];
					}
				];
			};
			Yarn: {
				Row: {
					colour: string | null;
					gauge: string | null;
					material: string | null;
					yardage: number | null;
					yarn_id: number;
					yarn_name: string | null;
				};
				Insert: {
					colour?: string | null;
					gauge?: string | null;
					material?: string | null;
					yardage?: number | null;
					yarn_id?: number;
					yarn_name?: string | null;
				};
				Update: {
					colour?: string | null;
					gauge?: string | null;
					material?: string | null;
					yardage?: number | null;
					yarn_id?: number;
					yarn_name?: string | null;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type PublicSchema = Database[Extract<keyof Database, "public">];

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
			Row: infer R;
	  }
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
			PublicSchema["Views"])
	? (PublicSchema["Tables"] &
			PublicSchema["Views"])[PublicTableNameOrOptions] extends {
			Row: infer R;
	  }
		? R
		: never
	: never;

export type TablesInsert<
	PublicTableNameOrOptions extends
		| keyof PublicSchema["Tables"]
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
	  }
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
	? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
			Insert: infer I;
	  }
		? I
		: never
	: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends
		| keyof PublicSchema["Tables"]
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
	  }
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
	? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
			Update: infer U;
	  }
		? U
		: never
	: never;

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
	: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof PublicSchema["CompositeTypes"]
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
	? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
	: never;
