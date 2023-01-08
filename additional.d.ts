type session = {
    user?: {
      _id?: string;
      username?: string;
      dateCreated?: string;
      passHash?: string;
      postIds?: array;
      currPost?: null | string;
      public?: boolean;
      family?: array;
      email?: string;
    };
  };