export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      character: {
        Row: {
          cooldown: number
          created_at: string
          damage: number
          hp: number
          hp_regen: number
          id: string
          level: number
          level_progress: number
          mana: number
          mana_cost: number
          mana_regen: number
          name: string
          party_position: number | null
          texture: string
          user_id: string | null
        }
        Insert: {
          cooldown?: number
          created_at?: string
          damage?: number
          hp?: number
          hp_regen?: number
          id?: string
          level?: number
          level_progress?: number
          mana?: number
          mana_cost?: number
          mana_regen?: number
          name: string
          party_position?: number | null
          texture: string
          user_id?: string | null
        }
        Update: {
          cooldown?: number
          created_at?: string
          damage?: number
          hp?: number
          hp_regen?: number
          id?: string
          level?: number
          level_progress?: number
          mana?: number
          mana_cost?: number
          mana_regen?: number
          name?: string
          party_position?: number | null
          texture?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "character_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      chest: {
        Row: {
          created_at: string
          id: string
          name: string
          rarity: string
          tile_id: string
          tile_object_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string
          rarity: string
          tile_id: string
          tile_object_type: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          rarity?: string
          tile_id?: string
          tile_object_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "chest_tile_id_fkey"
            columns: ["tile_id"]
            isOneToOne: false
            referencedRelation: "tile"
            referencedColumns: ["id"]
          },
        ]
      }
      floor: {
        Row: {
          created_at: string
          id: string
          mods: Json | null
          number: number
          run_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mods?: Json | null
          number: number
          run_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mods?: Json | null
          number?: number
          run_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "floor_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "run"
            referencedColumns: ["id"]
          },
        ]
      }
      monster: {
        Row: {
          created_at: string
          damage: number
          hp: number
          id: string
          max_hp: number
          name: string
          rarity: string
          texture: string
          tile_id: string | null
          tile_object_type: string
        }
        Insert: {
          created_at?: string
          damage: number
          hp: number
          id?: string
          max_hp: number
          name: string
          rarity: string
          texture: string
          tile_id?: string | null
          tile_object_type?: string
        }
        Update: {
          created_at?: string
          damage?: number
          hp?: number
          id?: string
          max_hp?: number
          name?: string
          rarity?: string
          texture?: string
          tile_id?: string | null
          tile_object_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "monster_tile_id_fkey"
            columns: ["tile_id"]
            isOneToOne: false
            referencedRelation: "tile"
            referencedColumns: ["id"]
          },
        ]
      }
      run: {
        Row: {
          active: boolean
          created_at: string
          essence: number | null
          gold: number | null
          id: string
          mods: Json
          party_damage: number
          party_hp: number
          party_hp_regen: number
          party_mana: number
          party_mana_regen: number
          party_max_hp: number
          party_max_mana: number
          user_id: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          essence?: number | null
          gold?: number | null
          id?: string
          mods?: Json
          party_damage: number
          party_hp: number
          party_hp_regen: number
          party_mana: number
          party_mana_regen: number
          party_max_hp: number
          party_max_mana: number
          user_id?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          essence?: number | null
          gold?: number | null
          id?: string
          mods?: Json
          party_damage?: number
          party_hp?: number
          party_hp_regen?: number
          party_mana?: number
          party_mana_regen?: number
          party_max_hp?: number
          party_max_mana?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "run_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      tile: {
        Row: {
          created_at: string
          floor_id: string
          hidden: boolean | null
          id: string
          run_id: string | null
          tile_type: string
          x: number
          y: number
        }
        Insert: {
          created_at?: string
          floor_id: string
          hidden?: boolean | null
          id?: string
          run_id?: string | null
          tile_type?: string
          x: number
          y: number
        }
        Update: {
          created_at?: string
          floor_id?: string
          hidden?: boolean | null
          id?: string
          run_id?: string | null
          tile_type?: string
          x?: number
          y?: number
        }
        Relationships: [
          {
            foreignKeyName: "tile_floor_id_fkey"
            columns: ["floor_id"]
            isOneToOne: false
            referencedRelation: "floor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tile_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "run"
            referencedColumns: ["id"]
          },
        ]
      }
      tile_object: {
        Row: {
          created_at: string
          damage: number | null
          hp: number | null
          id: string
          max_hp: number | null
          name: string
          rarity: string
          texture: string
          tile_id: string
          tile_object_type: string
        }
        Insert: {
          created_at?: string
          damage?: number | null
          hp?: number | null
          id?: string
          max_hp?: number | null
          name: string
          rarity: string
          texture: string
          tile_id: string
          tile_object_type: string
        }
        Update: {
          created_at?: string
          damage?: number | null
          hp?: number | null
          id?: string
          max_hp?: number | null
          name?: string
          rarity?: string
          texture?: string
          tile_id?: string
          tile_object_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "tile_object_tile_id_fkey"
            columns: ["tile_id"]
            isOneToOne: true
            referencedRelation: "tile"
            referencedColumns: ["id"]
          },
        ]
      }
      user: {
        Row: {
          admin: boolean | null
          created_at: string
          discord_avatar: string | null
          discord_id: string | null
          essence: number | null
          id: string
          name: string | null
        }
        Insert: {
          admin?: boolean | null
          created_at?: string
          discord_avatar?: string | null
          discord_id?: string | null
          essence?: number | null
          id?: string
          name?: string | null
        }
        Update: {
          admin?: boolean | null
          created_at?: string
          discord_avatar?: string | null
          discord_id?: string | null
          essence?: number | null
          id?: string
          name?: string | null
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
