export interface Paciente {
  id: number;
  numero?: number;
  nome: string;
  residencia?: string;
  enderecoCompleto?: string;
  profissao?: string;
  dataNascimento?: string;
  nacionalidade?: string;
  indicadoPor?: string;
  inicioTratamento?: string;
  terminoTratamento?: string | null;
  interrupcaoTratamento?: string | null;
  telefone?: string;
  telefoneSecundario?: string;
  estadoCivil?: string;
  dlne?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PacientePage {
  content: Paciente[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface PacienteListParams {
  page?: number;
  size?: number;
  sort?: string;
  nome?: string;
}
