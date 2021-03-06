import {
  Button,
  Container,
  createStyles,
  Stack,
  Avatar,
  TextInput,
  Card,
  Box,
} from "@mantine/core";
import { PostCard } from "../components/Post";
import { POSTS_LIMIT } from "../constants";
import { usePostsQuery } from "../graphql/generated/graphql";
import useAuth from "../hooks/useAuth";
import { useRouter } from "next/router";

const useStyles = createStyles(() => ({
  textInputCard: {
    display: "flex",
    alignItems: "center",
    margin: "10px 0",
    gap: 5,
  },
  textInput: {
    flexGrow: 1,
    "&: hover": {
      border: "1px solid grey",
      cursor: "pointer",
      borderRadius: "5px",
    },
  },
}));

const HomePage = () => {
  const { data, loading, error, fetchMore } = usePostsQuery({
    variables: {
      input: {
        cursor: null,
        limit: POSTS_LIMIT,
      },
    },
    notifyOnNetworkStatusChange: true,
  });
  const { isLoggedIn } = useAuth();
  const { classes } = useStyles();
  const router = useRouter();

  const handleOnClick = () => {
    fetchMore({
      variables: {
        input: {
          limit: POSTS_LIMIT,
          cursor: data?.posts[data.posts.length - 1]?.id,
        },
      },
    });
  };

  if (error) return <div>Error</div>;

  return (
    <Container>
      {isLoggedIn && (
        <Card
          withBorder
          radius="md"
          px="8px"
          py="8px"
          className={classes.textInputCard}
          component="div"
        >
          <Avatar radius="xl" />
          <TextInput
            placeholder="Create post"
            className={classes.textInput}
            onClick={() => {
              router.push("/create-post");
            }}
          />
        </Card>
      )}
      {data?.posts ? (
        <Stack spacing="sm">
          {data.posts.map((post) =>
            !post ? null : (
              <PostCard
                id={post.id}
                author={post.author}
                title={post.title}
                createdAt={post.createdAt}
                description={post.content || ""}
                key={post.id}
              />
            )
          )}
          <Button mb="md" onClick={handleOnClick} loading={loading}>
            {loading ? "Loading" : "Load More"}
          </Button>
        </Stack>
      ) : (
        <Box>No more post</Box>
      )}
    </Container>
  );
};

export default HomePage;
