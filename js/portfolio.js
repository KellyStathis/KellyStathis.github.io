app.controller('PortfolioController', ['$scope', function($scope, $sce) {
  $scope.mlis = "MLIS, 2017-2019",
  $scope.writing =
  {
    blog: [
    {
      title: 'Canadian Pacific Railway hotels in B.C.: Part 2',
      url: 'https://digitize.library.ubc.ca/digitizers-blog/canadian-pacific-railway-hotels-in-b-c-part-2/'
    },
    {
      title: 'Canadian Pacific Railway hotels in B.C.: Part 1',
      url: 'https://digitize.library.ubc.ca/digitizers-blog/canadian-pacific-railway-hotels-in-b-c-part-1'
    },
    {
      title: 'Explore Open Collections: Uno Langmann British Columbia Postcards',
      url: 'https://digitize.library.ubc.ca/digitizers-blog/explore-open-collections-uno-langmann-british-columbia-postcards/'
    },
    {
      title: 'Fauna boreali-americana',
      url: 'https://digitize.library.ubc.ca/digitizers-blog/fauna-boreali-americana/'
    },
    {
      title: 'Explore Open Collections: PRISM international',
      url: 'https://digitize.library.ubc.ca/digitizers-blog/explore-open-collections-prism-international/'
    },
    {
      title: 'The Empress Hotel',
      url: 'https://digitize.library.ubc.ca/digitizers-blog/the-empress-hotel'
    },
    {
      title: 'Discorder in December: winter concerts in Vancouver',
      url: 'https://digitize.library.ubc.ca/digitizers-blog/discorder-in-december-winter-concerts-in-vancouver/'
    },
    {
      title: 'John Latham’s birds',
      url: 'https://digitize.library.ubc.ca/digitizers-blog/john-lathams-birds/'
    },
    {
      title: 'Exploring The Herball in UBC Library’s Open Collections',
      url: 'https://digitize.library.ubc.ca/digitizers-blog/exploring-the-herball-in-ubc-librarys-open-collections/'
    },
    {
      title: 'Hotel Vancouver',
      url: 'https://digitize.library.ubc.ca/digitizers-blog/hotel-vancouver/'
    },
    {
      title: 'UBC\'s Fairview Campus',
      url: 'https://digitize.library.ubc.ca/digitizers-blog/ubcs-fairview-campus/'
    },
    {
      title: 'Teach me how: Using Open Collections for Genealogy Research',
      url: 'https://digitize.library.ubc.ca/digitizers-blog/teach-me-how-using-open-collections-for-genealogy-research'
    },
    {
      title: 'Explore Open Collections: Meiji at 150',
      url: 'https://digitize.library.ubc.ca/digitizers-blog/explore-open-collections-meiji-at-150/'
    }
  ],
    mlis: [
      {
        title: 'The IKEA products taxonomy',
        description: [
          'Taxonomy critique for LIBR 514E: Taxonomies, Research, and Evaluation'
        ]
      },
      {
        title: 'Linked data: benefits, challenges, and strategies',
        description: [
          'Issues paper for LIBR 581: Digital Libraries'
        ]
      },
      {
        title: 'Frida Kahlo materials at the Vancouver Public Library*',
        description: [
          'Collection evaluation and policy critique for LIBR 580: Collection Management'
        ]
      },
      {
        title: '"Where should I eat?": enhancing the UBC Food Services directory*',
        description: [
          'Information resource design & report for LIBR 506: Human Information Interaction'
        ]
      },
      {
        title: 'Digital Deficiencies: factors influencing users’ preferences between print & digital text*',
        description: [
          'Literature review & research design for LIBR 507: Methods of Research and Evaluation in Information Organizations'
        ]
      },
      {
        title: 'Hotspot Lending at Vancouver Public Library',
        description: [
          'Topic briefing for LIBR 508: Information Practices in Contemporary Society',
        ]
      }

    ],
    bmus: [
      {
        title: 'Julia Holter\'s "Maxim\'s II": Transcription and Analysis'
      },
      {
        title: '“Who in the World Am I?”: The Paradox of Universality in Unsuk Chin\'s <i>Alice in Wonderland</i>'
      },
      {
        title: 'Quotes and Monograms in Schnittke\'s Third String Quartet'
      },
      {
        title: 'To hear or not to hear: Audibility of Structure(s) in Ligeti\'s <i>Lux aeterna</i>'
      }
    ],
    bsc: [
      {
        title: "Coding in Your Library: A guide to programming coding workshops for teens"
      }
    ]
  }
  $scope.teaching =
  {
    core: [
      {
        title: 'Introduction to Databases and MS Access'
      }
    ],
    mlis: [
      {
        title: 'Collection Management of E-Journals*',
        description: [
          'For LIBR 580: Collection Management'
        ]
      },
      {
        title: 'The BC Digital Library Initiative*',
        description: [
          'For LIBR 581: Digital Libraries'
        ]
      },
      {
        title: 'Two-Factor Authentication (2FA)*',
        description: [
          'For LIBR 561: Information Policy'
        ]
      }
    ]

  }
  $scope.metadata = {
    mlis: [
      {
        title: 'RAD description of personal fonds',
        description: ['For ARST 515: Arrangement and Description of Archives']
      },
      {
        title: 'Subject heading system for a small children\'s book collection*',
        description: ['For LIBR 509: Foundations of Bibliographic Control']
      },
      {
        title: 'Faceted classification system for fictional characters',
        description: ['For LIBR 509: Foundations of Bibliographic Control']
      }
    ]
  }


}]);
