import * as React from 'react';
import styled from '@emotion/styled';
import HyperLink from 'components/atoms/HyperLink';
import Bio from 'components/molecules/Bio';
import SEO from 'components/templates/SEO';
import Markdown from 'components/atoms/Markdown';
import Row from 'components/templates/Row';
import { Text, H1Text } from 'components/atoms/Text';
import useConstant from 'utils/useConstant';
import useSiteMetadata from 'utils/useSiteMetadata';
import { rhythm, scale } from 'utils/typography';
import { graphql } from 'gatsby';
import ThematicBreak from 'components/atoms/ThematicBreak';

export default function Post(
  {
    data: {
        markdownRemark: {
          html: content,
          frontmatter: {
            title,
            date,
            description,
            somethings,
            keywords
          }
        }
    },
    pageContext: {
      previous,
      next
    }
  }) {
  const { author } = useSiteMetadata();
  function PostHeader() {
    const PostTitle = useConstant(() => styled(H1Text)`
      margin-top: ${rhythm(1)};
      margin-bottom: 0;
    `);
    function PostAdditionalInformation() {
      const PostDate = useConstant(() => styled(Text)`
        display: block;
        margin-bottom: ${rhythm(1)};
        ${scale(-1/7)};
      `);
      function PostSomethings() {
        const somethingAmount = parseInt(somethings);
        const { something } = useSiteMetadata();

        return (
          <Text>{something.repeat(somethingAmount)}</Text>
        );
      }

      return (
        <Row>
          <PostDate>
            {date}
          </PostDate>
          <PostSomethings />
        </Row>
      );
    }

    return (
      <>
        <PostTitle>
          {title}
        </PostTitle>
        <PostAdditionalInformation />
      </>
    );
  }
  function PostContent() {
    return (
      <Markdown>
        {content}
      </Markdown>
    );
  }
  function PostFooter({ previous, next }) {
    const StyledHr = useConstant(() => styled(ThematicBreak)`
      margin-bottom: ${rhythm(1)};
    `);
    const PostNavigatorDiv = styled.ul`
      display: grid;
      grid-template-columns: 50% 50%;
      list-style: none;
      padding-top: 0;
    `;
    function PostNavigator({ destinationPost, rel }) {
      const StyledLi = styled.li`
        grid-column: ${rel === 'prev' ? 1 : 2};
        justify-self: ${rel === 'prev' ? 'start' : 'end'};
      `;

      return (
        <StyledLi>
          <HyperLink to={destinationPost.fields.slug} rel={rel}>
            {
              rel === 'prev' ?
                `← ${destinationPost.frontmatter.title}` :
                `${destinationPost.frontmatter.title} →`
            }
          </HyperLink>
        </StyledLi>
      );
    }
    function PreviousPostNavigator() {
      return (
        <PostNavigator destinationPost={previous} rel={'prev'} />
      );
    }
    function NextPostNavigator() {
      return (
        <PostNavigator destinationPost={next} rel={'next'} />
      );
    }
    function PostNavigation() {
      return (
        <PostNavigatorDiv>
          {previous && <PreviousPostNavigator />}
          {next && <NextPostNavigator />}
        </PostNavigatorDiv>
      );
    }

    return (
      <>
        <StyledHr />
        <Bio />
        <PostNavigation />
      </>
    );
  }

  return (
    <>
      <SEO
        title={title}
        description={description}
        keywords={keywords}
        type='article'
        additionalMetaInfo={{
          article: {
            published_time: date,
            author,
            tag: keywords
          }
        }}
      />
      <PostHeader />
      <PostContent />
      <PostFooter previous={previous} next={next} />
    </>
  );
}

export const query = graphql`
  query PostBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        somethings
        keywords
      }
    }
  }
`;
