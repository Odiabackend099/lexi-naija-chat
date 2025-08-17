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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      security_audit: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          ip_address: string | null
          phone: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          phone: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          phone?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      sessions: {
        Row: {
          created_at: string | null
          email: string | null
          expires_at: string | null
          last_pin_attempt: string | null
          phone: string
          pin_attempts: number | null
          pin_hash: string | null
          step: string | null
          tmp: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          expires_at?: string | null
          last_pin_attempt?: string | null
          phone: string
          pin_attempts?: number | null
          pin_hash?: string | null
          step?: string | null
          tmp?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          expires_at?: string | null
          last_pin_attempt?: string | null
          phone?: string
          pin_attempts?: number | null
          pin_hash?: string | null
          step?: string | null
          tmp?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      tts_rate_limits: {
        Row: {
          blocked_until: string | null
          created_at: string
          id: string
          request_count: number
          request_ip: unknown
          session_id: string | null
          updated_at: string
          user_id: string | null
          window_start: string
        }
        Insert: {
          blocked_until?: string | null
          created_at?: string
          id?: string
          request_count?: number
          request_ip: unknown
          session_id?: string | null
          updated_at?: string
          user_id?: string | null
          window_start?: string
        }
        Update: {
          blocked_until?: string | null
          created_at?: string
          id?: string
          request_count?: number
          request_ip?: unknown
          session_id?: string | null
          updated_at?: string
          user_id?: string | null
          window_start?: string
        }
        Relationships: []
      }
      tts_usage_logs: {
        Row: {
          character_count: number
          created_at: string
          error_message: string | null
          id: string
          processing_time_ms: number | null
          request_ip: unknown | null
          session_id: string | null
          status: string
          text_content: string
          user_agent: string | null
          user_id: string | null
          voice_model: string
        }
        Insert: {
          character_count: number
          created_at?: string
          error_message?: string | null
          id?: string
          processing_time_ms?: number | null
          request_ip?: unknown | null
          session_id?: string | null
          status: string
          text_content: string
          user_agent?: string | null
          user_id?: string | null
          voice_model?: string
        }
        Update: {
          character_count?: number
          created_at?: string
          error_message?: string | null
          id?: string
          processing_time_ms?: number | null
          request_ip?: unknown | null
          session_id?: string | null
          status?: string
          text_content?: string
          user_agent?: string | null
          user_id?: string | null
          voice_model?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_pin_rate_limit: {
        Args: { session_phone: string }
        Returns: boolean
      }
      check_tts_rate_limit: {
        Args: {
          check_ip?: unknown
          check_session_id?: string
          check_user_id?: string
        }
        Returns: boolean
      }
      cleanup_expired_sessions: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      increment_pin_attempts: {
        Args: { session_phone: string }
        Returns: undefined
      }
      log_tts_usage: {
        Args: {
          log_character_count?: number
          log_error_message?: string
          log_processing_time_ms?: number
          log_request_ip?: unknown
          log_session_id?: string
          log_status?: string
          log_text_content?: string
          log_user_agent?: string
          log_user_id?: string
          log_voice_model?: string
        }
        Returns: string
      }
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
