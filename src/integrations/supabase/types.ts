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
      categoria: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string | null
          empresa_id: string
          id: string
          nome: string
          permite_dois_sabores: boolean
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          empresa_id: string
          id?: string
          nome: string
          permite_dois_sabores?: boolean
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          empresa_id?: string
          id?: string
          nome?: string
          permite_dois_sabores?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      cliente: {
        Row: {
          empresa_id: string | null
          id: string
          nome: string
          telefone: string
        }
        Insert: {
          empresa_id?: string | null
          id?: string
          nome: string
          telefone: string
        }
        Update: {
          empresa_id?: string | null
          id?: string
          nome?: string
          telefone?: string
        }
        Relationships: [
          {
            foreignKeyName: "cliente_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_cliente_empresa"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
        ]
      }
      empresa: {
        Row: {
          dias_funcionamento: Json | null
          endereco: string | null
          horario_abertura: string | null
          horario_fechamento: string | null
          id: string
          instagram: string | null
          logo: string | null
          nome: string
          user_id: string | null
          webhook_url: string | null
          whatsapp: string | null
        }
        Insert: {
          dias_funcionamento?: Json | null
          endereco?: string | null
          horario_abertura?: string | null
          horario_fechamento?: string | null
          id?: string
          instagram?: string | null
          logo?: string | null
          nome: string
          user_id?: string | null
          webhook_url?: string | null
          whatsapp?: string | null
        }
        Update: {
          dias_funcionamento?: Json | null
          endereco?: string | null
          horario_abertura?: string | null
          horario_fechamento?: string | null
          id?: string
          instagram?: string | null
          logo?: string | null
          nome?: string
          user_id?: string | null
          webhook_url?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      endereco: {
        Row: {
          cep: string | null
          cidade: string | null
          cliente_id: string
          complemento: string | null
          created_at: string
          descr_endereco: string
          empresa_id: string
          endereco: string | null
          estado: string | null
          id: string
          num_endereco: string | null
          updated_at: string
        }
        Insert: {
          cep?: string | null
          cidade?: string | null
          cliente_id: string
          complemento?: string | null
          created_at?: string
          descr_endereco: string
          empresa_id: string
          endereco?: string | null
          estado?: string | null
          id?: string
          num_endereco?: string | null
          updated_at?: string
        }
        Update: {
          cep?: string | null
          cidade?: string | null
          cliente_id?: string
          complemento?: string | null
          created_at?: string
          descr_endereco?: string
          empresa_id?: string
          endereco?: string | null
          estado?: string | null
          id?: string
          num_endereco?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      pedido: {
        Row: {
          datahora: string | null
          empresa_id: string | null
          endereco_entrega: string | null
          id: string
          idcliente: string | null
          observacao: string | null
          status: string | null
          tipopagamento: string | null
          total: number
        }
        Insert: {
          datahora?: string | null
          empresa_id?: string | null
          endereco_entrega?: string | null
          id?: string
          idcliente?: string | null
          observacao?: string | null
          status?: string | null
          tipopagamento?: string | null
          total: number
        }
        Update: {
          datahora?: string | null
          empresa_id?: string | null
          endereco_entrega?: string | null
          id?: string
          idcliente?: string | null
          observacao?: string | null
          status?: string | null
          tipopagamento?: string | null
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_pedido_cliente"
            columns: ["idcliente"]
            isOneToOne: false
            referencedRelation: "cliente"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_pedido_empresa"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_idcliente_fkey"
            columns: ["idcliente"]
            isOneToOne: false
            referencedRelation: "cliente"
            referencedColumns: ["id"]
          },
        ]
      }
      pedido_tokens: {
        Row: {
          access_token: string
          created_at: string
          empresa_id: string
          expira_em: string
          id: string
          idcliente: string
          usado: boolean
        }
        Insert: {
          access_token: string
          created_at?: string
          empresa_id: string
          expira_em?: string
          id?: string
          idcliente: string
          usado?: boolean
        }
        Update: {
          access_token?: string
          created_at?: string
          empresa_id?: string
          expira_em?: string
          id?: string
          idcliente?: string
          usado?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "fk_pedido_tokens_cliente"
            columns: ["idcliente"]
            isOneToOne: false
            referencedRelation: "cliente"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_pedido_tokens_empresa"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidoitem: {
        Row: {
          empresa_id: string | null
          id: string
          idpedido: string | null
          idproduto: string | null
          obs: string | null
          qtd: number
          valor: number
        }
        Insert: {
          empresa_id?: string | null
          id?: string
          idpedido?: string | null
          idproduto?: string | null
          obs?: string | null
          qtd: number
          valor: number
        }
        Update: {
          empresa_id?: string | null
          id?: string
          idpedido?: string | null
          idproduto?: string | null
          obs?: string | null
          qtd?: number
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_pedidoitem_empresa"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_pedidoitem_pedido"
            columns: ["idpedido"]
            isOneToOne: false
            referencedRelation: "pedido"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_pedidoitem_produto"
            columns: ["idproduto"]
            isOneToOne: false
            referencedRelation: "produto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidoitem_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidoitem_idpedido_fkey"
            columns: ["idpedido"]
            isOneToOne: false
            referencedRelation: "pedido"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidoitem_idproduto_fkey"
            columns: ["idproduto"]
            isOneToOne: false
            referencedRelation: "produto"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidoitem_complemento: {
        Row: {
          complemento_id: string
          created_at: string
          empresa_id: string
          id: string
          pedidoitem_id: string
          qtd: number
          valor: number
        }
        Insert: {
          complemento_id: string
          created_at?: string
          empresa_id: string
          id?: string
          pedidoitem_id: string
          qtd?: number
          valor: number
        }
        Update: {
          complemento_id?: string
          created_at?: string
          empresa_id?: string
          id?: string
          pedidoitem_id?: string
          qtd?: number
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_pedidoitem_complemento"
            columns: ["pedidoitem_id"]
            isOneToOne: false
            referencedRelation: "pedidoitem"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_pedidoitem_complemento_produto"
            columns: ["complemento_id"]
            isOneToOne: false
            referencedRelation: "produto"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidoitem_sabores: {
        Row: {
          empresa_id: string
          id: string
          idpedidoitem: string
          idproduto: string
          posicao: number
        }
        Insert: {
          empresa_id: string
          id?: string
          idpedidoitem: string
          idproduto: string
          posicao: number
        }
        Update: {
          empresa_id?: string
          id?: string
          idpedidoitem?: string
          idproduto?: string
          posicao?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_pedidoitem_sabores"
            columns: ["idpedidoitem"]
            isOneToOne: false
            referencedRelation: "pedidoitem"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_pedidoitem_sabores_produto"
            columns: ["idproduto"]
            isOneToOne: false
            referencedRelation: "produto"
            referencedColumns: ["id"]
          },
        ]
      }
      produto: {
        Row: {
          ativo: boolean | null
          categoria: string | null
          descricao: string
          detalhes: string | null
          empresa_id: string | null
          id: string
          idcategoria: string | null
          imagem: string | null
          vlrvenda: number
        }
        Insert: {
          ativo?: boolean | null
          categoria?: string | null
          descricao: string
          detalhes?: string | null
          empresa_id?: string | null
          id?: string
          idcategoria?: string | null
          imagem?: string | null
          vlrvenda: number
        }
        Update: {
          ativo?: boolean | null
          categoria?: string | null
          descricao?: string
          detalhes?: string | null
          empresa_id?: string | null
          id?: string
          idcategoria?: string | null
          imagem?: string | null
          vlrvenda?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_produto_categoria"
            columns: ["idcategoria"]
            isOneToOne: false
            referencedRelation: "categoria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_produto_empresa"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produto_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
        ]
      }
      produto_complemento: {
        Row: {
          complemento_id: string
          created_at: string
          empresa_id: string
          id: string
          max_itens: number | null
          obrigatorio: boolean
          produto_id: string
          updated_at: string
        }
        Insert: {
          complemento_id: string
          created_at?: string
          empresa_id: string
          id?: string
          max_itens?: number | null
          obrigatorio?: boolean
          produto_id: string
          updated_at?: string
        }
        Update: {
          complemento_id?: string
          created_at?: string
          empresa_id?: string
          id?: string
          max_itens?: number | null
          obrigatorio?: boolean
          produto_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_produto_complemento_complemento"
            columns: ["complemento_id"]
            isOneToOne: false
            referencedRelation: "produto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_produto_complemento_produto"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produto"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          empresa_id: string | null
          id: string
          nome: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          empresa_id?: string | null
          id?: string
          nome: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          empresa_id?: string | null
          id?: string
          nome?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresa"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_valid_token_for_empresa: {
        Args: { empresa_uuid: string }
        Returns: boolean
      }
      generate_access_token: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_access_token2: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      sha1: {
        Args: { input_text: string }
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
