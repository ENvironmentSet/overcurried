import * as React from 'react';
import styled from '@emotion/styled';
import Bio from 'components/molecules/Bio';
import SEO from 'components/templates/SEO';
import HyperLink from 'components/atoms/HyperLink';
import Row from 'components/templates/Row';
import { Text, SmallText, H3Text } from 'components/atoms/Text';
import Accent from 'components/atoms/Accent';
import { rhythm, scale } from 'utils/typography';
import useConstant from 'utils/useConstant';
import useSiteMetadata from 'utils/useSiteMetadata';
import { graphql } from 'gatsby';

export default function Index({ data: { allMarkdownRemark: { edges } } }) {
  const posts = edges.map(({ node: { fields, frontmatter } }) => ({ ...fields, ...frontmatter }));
  const { title, description, keywords } = useSiteMetadata();
  function PostPreviewList({ posts }) {
    function PostPreview({ post }) {
      function PostTitlePreview() {
        const StyledTitle = useConstant(() => styled(H3Text)`
        margin-bottom: ${rhythm(1/4)};
      `);

        return (
          <HyperLink to={post.slug}>
            <StyledTitle>
              <Accent>
                {post.title}
              </Accent>
            </StyledTitle>
          </HyperLink>
        );
      }
      function PostAdditionalInformationPreview() {
        function PostDatePreview() {
          const PostDate = useConstant(() => styled(SmallText)`
            ${scale(-1/7)};
          `);

          return (
            <PostDate>{post.date}</PostDate>
          );
        }
        function PostSomethingsPreview() {
          const somethingAmount = parseInt(post.somethings);
          const { something } = useSiteMetadata();

          return (
            <SmallText>{something.repeat(somethingAmount)}</SmallText>
          );
        }

        return (
          <Row>
            <PostDatePreview />
            <PostSomethingsPreview />
          </Row>
        );
      }
      function PostDescriptionPreview() {
        return (
          <Text>{post.description}</Text>
        );
      }

      return (
        <>
          <PostTitlePreview />
          <PostAdditionalInformationPreview />
          <PostDescriptionPreview />
        </>
      );
    }
    return posts.map(post => <PostPreview key={post.slug} post={post} />);
  }

  return (
    <>
      <SEO title={title} description={description} keywords={keywords.join()} />
      <Bio />
      <PostPreviewList posts={posts} />
    </>
  );
};

export const query = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
            somethings
          }
        }
      }
    }
  }
`;
