export const ESTADO_CIVIL_VALUES = [
  "SOLTEIRO",
  "CASADO",
  "DIVORCIADO",
  "VIUVO",
  "UNIAO_ESTAVEL",
] as const;

export type EstadoCivil = (typeof ESTADO_CIVIL_VALUES)[number];

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
  estadoCivil?: EstadoCivil;
  dlne?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PacienteFormData {
  nome: string;
  numero?: number;
  residencia?: string;
  enderecoCompleto?: string;
  profissao?: string;
  dataNascimento?: string;
  nacionalidade?: string;
  indicadoPor?: string;
  inicioTratamento?: string;
  terminoTratamento?: string;
  interrupcaoTratamento?: string;
  telefone?: string;
  telefoneSecundario?: string;
  estadoCivil?: EstadoCivil;
  dlne?: boolean;
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
