export interface Filters {
  currencies: {
    code: string;
    displayName: string;
    description: string;
    group: string;
    order: number;
    isActive: boolean;
    icon: string;
    tooltip: string;
    metadata: Record<string, string>;
  }[];
  customerIdentifiers: {
    code: string;
    displayName: string;
    description: string;
    group: string;
    order: number;
    isActive: boolean;
    icon: string;
    tooltip: string;
    metadata: Record<string, string>;
  }[];
  externalParticipants: {
    code: string;
    displayName: string;
    description: string;
    group: string;
    order: number;
    isActive: boolean;
    icon: string;
    tooltip: string;
    metadata: Record<string, string>;
  }[];
  externalParticipantAcronyms: {
    code: string;
    displayName: string;
    description: string;
    group: string;
    order: number;
    isActive: boolean;
    icon: string;
    tooltip: string;
    metadata: Record<string, string>;
  }[];
  periods: {
    code: string;
    displayName: string;
    description: string;
    group: string;
    order: number;
    isActive: boolean;
    icon: string;
    tooltip: string;
    metadata: Record<string, string>;
  }[];
  transactions: {
    code: string;
    displayName: string;
    description: string;
    group: string;
    order: number;
    isActive: boolean;
    icon: string;
    tooltip: string;
    metadata: Record<string, string>;
  }[];
  paymentChannels: {
    code: string;
    displayName: string;
    description: string;
    group: string;
    order: number;
    isActive: boolean;
    icon: string;
    tooltip: string;
    metadata: Record<string, string>;
  }[];
}

export interface Transfers {
  traceNumber: string;
  formattedDate: string;
  formattedHour: string;
  originatorAccountNumber: string;
  originatorParticipantAcronym: string;
  receiverAccountNumber: string;
  receiverParticipantAcronym: string;
  currencyDisplayName: string;
  amount: number;
  transactionDisplayName: string;
  statusDisplayName: string;
}

export interface OptionsResponse {
  Filters: Filters;
}

export interface RequestTransactionalRequest {
  isInbound: boolean;
  isOutbound: boolean;
  formattedDate: string;
  customerIdentifierCode: string;
  customerIdentifier: string;
  currencyCodes: string[];
  transactionCodes: string[];
  accountNumber: string;
  externalParticipantCode: string;
}

export interface RequestTransactionalResponse {
  transfers: Transfers[];
}


export interface IndividualTransactionResponse {
  externalTraceNumber: string;
  formattedDate: string;
  currencyDisplayName: string;
  amount: number;
  reference: string;
  originator: {
    participantName: string;
    participantAcronym: string;
    accountHolderName: string;
    productNumber: string;
    productTypeDisplayName: string;
  },
  receiver: {
    participantName: string;
    participantAcronym: string;
    accountHolderName: string;
    productNumber: string;
    productTypeDisplayName: string;
  },
  financialTransaction: {
    formattedDate: string;
    formattedHour: string;
    productTypeDescription: string;
    productNumber: string;
    currencyDisplayName: string;
    amount: number;
    transferId: string;
  }
}
