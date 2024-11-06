import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./App.module.scss";
import { useQuery } from "@apollo/client";
import {
  Choice,
  Course,
  CoursesResponse,
  GET_COURSES,
  getOutcome,
  getSample,
  Sample,
} from "@/lib/api";
import {
  Box,
  Button,
  Card,
  Container,
  Dialog,
  Flex,
  Heading,
  Spinner,
  Text,
  TextField,
} from "@radix-ui/themes";
import {
  ArrowTopLeftIcon,
  ArrowTopRightIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  UpdateIcon,
  ValueNoneIcon,
  WidthIcon,
} from "@radix-ui/react-icons";

function App() {
  const [sample, setSample] = useState<Sample | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [query, setQuery] = useState("");

  const { data, loading } = useQuery<CoursesResponse>(GET_COURSES);
  const courses = useMemo(() => data?.courses, [data]);

  const parsedSample = useMemo(() => {
    if (!sample || !courses) return;

    return {
      ...sample,
      models: sample.results.map((result) => ({
        ...result,
        courses: result.courses.reduce((acc, match) => {
          const course = courses.find(
            (course) =>
              course.subject === match.subject && course.number === match.number
          );

          if (course) return [...acc, course];

          return acc;
        }, [] as Course[]),
      })),
    };
  }, [sample, courses]);

  const initialize = useCallback(async (query?: string) => {
    setInitializing(true);

    try {
      const sample = await getSample(query);
      setSample(sample);
    } catch (error) {
      console.error(error);
    }

    setInitializing(false);
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleClick = async (choice: Choice) => {
    if (!sample) return;

    setInitializing(true);

    try {
      await getOutcome(
        sample.query,
        sample.results[0].model,
        sample.results[1].model,
        choice
      );

      const _sample = await getSample();
      setSample(_sample);
    } catch (error) {
      console.error(error);
    }

    setInitializing(false);
  };

  const handleSubmit = async () => {
    if (!query.trim()) return;

    await initialize(query);
  };

  const disabled = useMemo(
    () => !parsedSample || loading || initializing,
    [parsedSample, loading, initializing]
  );

  return (
    <div className={styles.root}>
      <Container className={styles.container}>
        <Flex direction="column" className={styles.view} p="5" gap="5">
          <Flex justify="between" align="center">
            <Dialog.Root>
              <Dialog.Trigger>
                <Button variant="outline" color="gray" disabled={disabled}>
                  <MagnifyingGlassIcon />
                  Custom query
                </Button>
              </Dialog.Trigger>
              <Dialog.Content maxWidth="450px">
                <Flex direction="column" gap="4">
                  <Flex direction="column" gap="2">
                    <Dialog.Title mb="0">Custom query</Dialog.Title>
                    <Dialog.Description size="2">
                      Compare two models based on a custom query.
                    </Dialog.Description>
                  </Flex>
                  <label>
                    <Flex direction="column" gap="2">
                      <Text size="2" color="gray">
                        Query
                      </Text>
                      <TextField.Root
                        placeholder="Enter a custom query..."
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                      />
                    </Flex>
                  </label>
                  <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                      <Button variant="outline" color="gray">
                        Cancel
                      </Button>
                    </Dialog.Close>
                    <Dialog.Close>
                      <Button variant="classic" onClick={() => handleSubmit()}>
                        Submit
                      </Button>
                    </Dialog.Close>
                  </Flex>
                </Flex>
              </Dialog.Content>
            </Dialog.Root>
            {parsedSample && <Heading size="4">{parsedSample.query}</Heading>}
            <Button
              variant="outline"
              color="gray"
              onClick={() => initialize()}
              disabled={disabled}
            >
              Random query
              <UpdateIcon />
            </Button>
          </Flex>
          {loading || initializing ? (
            <Flex flexGrow="1" align="center" justify="center" gap="4">
              <Spinner />
              <Text color="gray">Loading...</Text>
            </Flex>
          ) : parsedSample ? (
            <Flex gap="5" flexGrow="1" overflow="hidden">
              {parsedSample.models.map((result, index) => (
                <Flex
                  direction="column"
                  flexGrow="1"
                  flexShrink="1"
                  flexBasis="0"
                  className={styles.model}
                  key={result.model}
                  overflow="hidden"
                >
                  <Flex
                    justify="between"
                    p="4"
                    className={styles.header}
                    align="center"
                  >
                    <Heading size="3" color="indigo">
                      Model {index === 0 ? "A" : "B"}
                    </Heading>
                    <Text color="gray" size="2">
                      {result.courses.length} course(s)
                    </Text>
                  </Flex>
                  <Box flexGrow="1" overflow="auto">
                    <Flex gap="4" p="4" direction="column">
                      {result.courses.map((course) => (
                        <Card
                          key={`${course.subject} ${course.number}`}
                          size="2"
                        >
                          <Flex direction="column" gap="1">
                            <Text size="1" color="gray">
                              {course.subject} {course.number}
                            </Text>
                            <Heading size="3">{course.title}</Heading>
                            <Text color="gray" size="2">
                              {course.description}
                            </Text>
                          </Flex>
                        </Card>
                      ))}
                    </Flex>
                  </Box>
                </Flex>
              ))}
            </Flex>
          ) : (
            <Flex
              flexGrow="1"
              align="center"
              direction="column"
              gap="4"
              justify="center"
            >
              <ExclamationTriangleIcon
                width={24}
                height={24}
                color="var(--red-9)"
              />
              <Text>Something went wrong...</Text>
              <Button
                variant="classic"
                color="red"
                onClick={() => window.location.reload()}
              >
                <UpdateIcon />
                Refresh
              </Button>
            </Flex>
          )}
          <Flex justify="between">
            <Button
              variant="classic"
              onClick={() => handleClick(1)}
              disabled={disabled}
            >
              <ArrowTopLeftIcon />
              Model A is better
            </Button>
            <Flex gap="4">
              <Button
                variant="outline"
                color="gray"
                onClick={() => handleClick(0)}
                disabled={disabled}
              >
                <WidthIcon />
                Tie
              </Button>
              <Button
                variant="classic"
                color="red"
                onClick={() => handleClick(-1)}
                disabled={disabled}
              >
                <ValueNoneIcon />
                Both are bad
              </Button>
            </Flex>
            <Button
              variant="classic"
              onClick={() => handleClick(2)}
              disabled={disabled}
            >
              Model B is better
              <ArrowTopRightIcon />
            </Button>
          </Flex>
        </Flex>
      </Container>
    </div>
  );
}

export default App;
