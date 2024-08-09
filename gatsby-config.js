const cosmiconfig = require('cosmiconfig');
const searchResult = cosmiconfig('oversomething').searchSync(__dirname);

if (searchResult === null) throw new Error('Can\'t find site configuration');
else {
  const { config: { siteMetadata, ...config } } = searchResult;

  module.exports = {
    siteMetadata,
    plugins: [
      {
        resolve: 'gatsby-source-filesystem',
        options: {
          path: `${__dirname}/content/posts`,
          name: 'posts',
        },
      },
      {
        resolve: 'gatsby-source-filesystem',
        options: {
          path: `${__dirname}/content/assets`,
          name: 'assets',
        },
      },
      {
        resolve: 'gatsby-transformer-remark',
        options: {
          plugins: [
            {
              resolve: 'gatsby-remark-images',
              options: {
                maxWidth: 590,
              },
            },
            {
              resolve: 'gatsby-remark-responsive-iframe',
              options: {
                wrapperStyle: 'margin-bottom: 1.0725rem',
              },
            },
            'gatsby-remark-prismjs',
            'gatsby-remark-copy-linked-files',
            'gatsby-remark-smartypants',
          ],
        },
      },
      'gatsby-transformer-sharp',
      'gatsby-plugin-sharp',
      {
        resolve: 'gatsby-plugin-gtag',
        options: {
          head: true,
          trackingId: config.gaTrackingId || '',
        },
      },
      {
        resolve: 'gatsby-plugin-gtag',
        options: {
          head: true,
          trackingId: config.ga4TrackingId || '',
        },
      },
      {
        resolve: 'gatsby-plugin-manifest',
        options: {
          name: siteMetadata.title,
          description: siteMetadata.description,
          start_url: '/',
          background_color: '#212121',
          theme_color: '#212121',
          display: 'minimal-ui',
          [config.useIcon && 'icon']: 'content/assets/icon.ico'
        },
      },
      'gatsby-plugin-offline',
      'gatsby-plugin-react-helmet',
      {
        resolve: 'gatsby-plugin-typography',
        options: {
          pathToConfigModule: 'src/utils/typography',
        },
      },
      {
        resolve: 'gatsby-plugin-robots-txt',
        options: {
          policy: [
            {
              userAgent: '*',
              allow: '/',
            }
          ],
        },
      },
      'gatsby-plugin-sitemap',
      {
        resolve: 'gatsby-plugin-feed',
        options: {
          query: `
          {
            site {
              siteMetadata {
                title
                author
                description
                categories: keywords
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
          feeds: [
            {
              query: `
              {
                allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
                  edges {
                    node {
                      html
                      fields {
                        slug
                      }
                      frontmatter {
                        title
                        date
                        description
                      }
                    }
                  }
                }
              }
            `,
              serialize: ({ query: { site: { siteMetadata: { siteUrl } }, allMarkdownRemark: { edges } } }) =>
                edges.map(({ node: { frontmatter, fields: { slug }, html } }) => ({
                  ...frontmatter,
                  url: encodeURI(siteUrl + slug),
                  guid: slug,
                  custom_elements: [{ "content:encoded": html }]
                })),
              output: '/rss.xml',
              title: 'overcurried',
            },
          ],
        },
      }
    ],
  };
}