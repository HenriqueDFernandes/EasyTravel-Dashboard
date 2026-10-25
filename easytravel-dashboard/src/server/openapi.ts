export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'EasyTravel Flights API',
    version: '1.0.0',
    description: 'API de busca de voos do dashboard EasyTravel.',
  },
  paths: {
    '/api/flights': {
      get: {
        summary: 'Buscar voos',
        description: 'Busca voos de ida ou ida e volta. Quando o provedor externo falha, a resposta pode conter dados fictícios e isMockData=true.',
        parameters: [
          {
            name: 'origin',
            in: 'query',
            required: true,
            description: 'Código IATA do aeroporto de origem.',
            schema: { type: 'string', example: 'GRU' },
          },
          {
            name: 'destination',
            in: 'query',
            required: true,
            description: 'Código IATA do aeroporto de destino.',
            schema: { type: 'string', example: 'REC' },
          },
          {
            name: 'date',
            in: 'query',
            required: true,
            description: 'Data de ida no formato YYYY-MM-DD.',
            schema: { type: 'string', format: 'date', example: '2026-06-01' },
          },
          {
            name: 'tripType',
            in: 'query',
            required: false,
            description: 'Tipo de viagem. O padrão é one-way.',
            schema: { type: 'string', enum: ['one-way', 'round-trip'], default: 'one-way' },
          },
          {
            name: 'returnDate',
            in: 'query',
            required: false,
            description: 'Data de volta no formato YYYY-MM-DD; obrigatória para round-trip.',
            schema: { type: 'string', format: 'date', example: '2026-06-10' },
          },
          {
            name: 'limit',
            in: 'query',
            required: false,
            description: 'Número máximo de voos por trecho. Valores inválidos usam o padrão 20.',
            schema: { type: 'integer', minimum: 1, default: 20 },
          },
        ],
        responses: {
          '200': {
            description: 'Busca concluída.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['tripType', 'outboundFlights', 'returnFlights'],
                  properties: {
                    tripType: { type: 'string', enum: ['one-way', 'round-trip'] },
                    outboundFlights: { type: 'array', items: { $ref: '#/components/schemas/ApiFlight' } },
                    returnFlights: { type: 'array', items: { $ref: '#/components/schemas/ApiFlight' } },
                    isMockData: { type: 'boolean', description: 'Presente quando os dados retornados são fictícios.' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Parâmetros obrigatórios ausentes ou datas inválidas.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '502': {
            description: 'Falha de comunicação com o provedor ou resposta inválida.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '503': {
            description: 'Chave da FlightAPI não configurada no servidor.',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      ApiFlight: {
        type: 'object',
        required: ['id', 'airline', 'price', 'duration', 'departure', 'arrival', 'stops', 'origin', 'destination'],
        properties: {
          id: { type: 'string' },
          airline: { type: 'string' },
          price: { type: 'number', format: 'float' },
          duration: { type: 'string', example: '2h 45m' },
          departure: { type: 'string', format: 'date-time' },
          arrival: { type: 'string', format: 'date-time' },
          stops: { type: 'integer', minimum: 0 },
          origin: { type: 'string', example: 'GRU' },
          destination: { type: 'string', example: 'REC' },
        },
      },
      Error: {
        type: 'object',
        required: ['message'],
        properties: {
          message: { type: 'string' },
        },
      },
    },
  },
} as const;
