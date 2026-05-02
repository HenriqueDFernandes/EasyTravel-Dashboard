flowchart TD
    U[Usuario] -->|preenche criterios| SF[SearchFormComponent]
    U -->|ajusta ordenacao e filtros| FP[FilterPanelComponent]
    U -->|seleciona/remocao de historico| RS[RecentSearchesComponent]

    subgraph FE[Frontend Angular - Browser]
        AC[AppComponent\nOrquestracao de estado]
        SF
        FP
        RS
        FR[FlightResultsComponent]
        FS[FlightService]
        SH[SearchHistoryService]
        ENV[environment.ts\napiBaseUrl=/api]
        LS[(localStorage)]
        MOCK[(mockFlights fallback)]
    end

    subgraph BE[Backend SSR - Node/Express]
        API[/GET /api/flights/]
        MAP[Mapeamento Aviationstack -> Flight]
        KEY[(AVIATIONSTACK_API_KEY)]
    end

    subgraph EXT[Servico Externo]
        AV[Aviationstack API]
    end

    SF -->|SearchQuery| AC
    FP -->|filtersChange + sortByChange| AC
    RS -->|select e remove| AC
    AC -->|renderiza lista final| FR
    AC -->|salva e le historico| SH
    SH --> LS

    AC -->|searchFlights query| FS
    FS --> ENV
    FS -->|GET api flights| API
    API -->|usa chave no servidor| KEY
    API -->|consulta voos| AV
    AV -->|payload bruto| API
    API -->|dados normalizados Flight list| FS
    FS -->|fallback em erro| MOCK
    FS -->|Flight list| AC
