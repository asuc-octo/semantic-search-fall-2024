import { gql } from "@apollo/client";

export const API_BASE = "/api";
export const GRAPHQL_BASE = "https://stanfurdtime.com/api/graphql";

export interface Match {
  subject: string;
  number: string;
  score?: number;
}

export type Model = string & {
  readonly __brand: unique symbol;
};

export interface Result {
  model: Model;
  courses: Match[];
}

export interface Outcome {
  model: Model;
  elo: number;
}

export interface Sample {
  query: string;
  results: Result[];
}

export type Choice = 1 | 2 | 0 | -1;

export const getOutcome = async (
  query: string,
  firstModel: Model,
  secondModel: Model,
  choice: Choice
) => {
  const response = await fetch(
    `${API_BASE}/outcome?query=${query}&firstModel=${firstModel}&secondModel=${secondModel}&choice=${choice}`
  );

  return (await response.json()) as Outcome[];
};

export const getSample = async (query?: string) => {
  let url = `${API_BASE}/sample`;
  if (query) url += `?query=${query}`;

  const response = await fetch(url);

  return (await response.json()) as Sample;
};

export const getModels = async () => {
  const response = await fetch(`${API_BASE}/models`);

  return (await response.json()) as Model[];
};

export const getCourses = async (query: string, topK = 10, model?: string) => {
  const searchParams = new URLSearchParams({
    query,
    topK: topK.toString(),
  });

  if (model) searchParams.set("model", model);

  const response = await fetch(`${API_BASE}/courses?${searchParams}`);

  return (await response.json()) as Model[];
};

export interface Course {
  subject: string;
  number: string;
  title: string;
  description: string;
}

export interface CoursesResponse {
  courseList: Course[];
}

export const GET_COURSES = gql`
  query GetCourses {
    courseList {
      subject
      number
      title
      description
    }
  }
`;
