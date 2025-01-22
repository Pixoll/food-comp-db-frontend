import { useState } from "react";
import { Collection } from "../utils/collection";
import { FetchStatus, useFetch } from "./useFetch";

export type LangualCode = {
  id: number;
  code: string;
  descriptor: string;
  parentId: number | null;
};

export class LangualCollection extends Collection<string, LangualCode> {
  private parentIndex: Map<number, LangualCode[]>;

  constructor() {
    super();
    this.parentIndex = new Map();
  }

  override set(key: string, value: LangualCode): this {
    super.set(key, value);

    if (value.parentId !== null) {
      const siblings = this.parentIndex.get(value.parentId) || [];
      siblings.push(value);
      this.parentIndex.set(value.parentId, siblings);
    }

    return this;
  }

  getChildrenByParentId(parentId: number): LangualCode[] {
    return this.parentIndex.get(parentId) || [];
  }

  override clone(): LangualCollection {
    const cloned = new LangualCollection();
    this.forEach((value, key) => {
      cloned.set(key, { ...value });
    });
    return cloned;
  }
}

export function useLangualCodes() {
  const result = useFetch<LangualCode[]>("/langual-codes");
  const [langualCodes, setLangualCodes] = useState(new LangualCollection());

  if (result.status === FetchStatus.Success && langualCodes.size === 0) {
    result.data.forEach((langualCode) => {
      langualCodes.set(langualCode.id.toString(), langualCode);
    });
    setLangualCodes(langualCodes.clone());
  }

  return langualCodes;
}
