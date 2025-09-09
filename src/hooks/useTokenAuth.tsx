import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TokenData {
  empresa: {
    id: string;
    nome: string;
  };
  cliente: {
    id: string;
    nome: string;
    telefone: string;
  };
}

export const useTokenAuth = () => {
  const [isValidToken, setIsValidToken] = useState(false);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateToken = useCallback(async (accessToken: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('validate-token', {
        body: { access_token: accessToken }
      });

      if (error || !data?.valid) {
        setIsValidToken(false);
        setTokenData(null);
        return false;
      }

      setIsValidToken(true);
      setTokenData(data);
      return true;
    } catch (error) {
      console.error('Erro ao validar token:', error);
      setIsValidToken(false);
      setTokenData(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markTokenAsUsed = useCallback(async (accessToken: string) => {
    try {
      await supabase.functions.invoke('mark-token-used', {
        body: { access_token: accessToken }
      });
    } catch (error) {
      console.error('Erro ao marcar token como usado:', error);
    }
  }, []);

  return {
    isValidToken,
    tokenData,
    isLoading,
    validateToken,
    markTokenAsUsed
  };
};