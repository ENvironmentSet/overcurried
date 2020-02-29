import { useStaticQuery, graphql } from 'gatsby';

export default function useSiteMetadata() {
  return useStaticQuery(graphql`
    query getSiteMetadata {
      site {
        siteMetadata {
          title
          author
          description
          siteUrl
          social {
            github
            twitter
            email
          }
          something
          theme {
            background
            text
            accent
            hyperLink
          }
          keywords
          locale
        }
      }
    }
  `).site.siteMetadata;
};