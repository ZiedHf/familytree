enum Gender {
  M = "M",
  F = "F",
}

type Person = {
  key: number;
  name: string;
  gender: Gender;
  parent?: number;
  birthYear?: string;
  deathYear?: string;
  description?: string;
  partner?: string;
};

export type { Person };
export { Gender };
