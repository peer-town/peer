// This is an auto-generated file, do not edit manually
import type {RuntimeCompositeDefinition} from '@composedb/types'

export const definition: RuntimeCompositeDefinition = {
  "models": {
    "Comment": {
      "id": "kjzl6hvfrbw6c9x0v0j4keukbnyqmurnko9zknd1sj7pzfjqe1wfmpgw9rg5x1w",
      "accountRelation": {"type": "list"}
    },
    "Thread": {
      "id": "kjzl6hvfrbw6c85luxixex8z6bjlzli1e2obz1cptcxre5dfd1tbmip52od049x",
      "accountRelation": {"type": "list"}
    },
    "User": {
      "id": "kjzl6hvfrbw6c828cr9zv69x34395lnxo7g5f6uwnxlv3fnwtgho7e5o3hayx0d",
      "accountRelation": {"type": "single"}
    },
    "CommunityTag": {
      "id": "kjzl6hvfrbw6c7zj6mhyhon8t5ig3w8489iqvyacqvz338p7em8ft3uvu93639g",
      "accountRelation": {"type": "list"}
    },
    "Tag": {
      "id": "kjzl6hvfrbw6c9mri41w31xgzu53xca1k1y0jg0lbolkujfa4t1ilvoo3nkvffr",
      "accountRelation": {"type": "list"}
    },
    "Community": {
      "id": "kjzl6hvfrbw6c6w86fbnft0c83g7hqscx6urkpz49bgv380hzudelk359m9q5vu",
      "accountRelation": {"type": "list"}
    },
    "SocialPlatform": {
      "id": "kjzl6hvfrbw6cb3lqz7isqv48dffi80fqxrcrbjjr8xnm4oy84gp8t3lqcfrbkl",
      "accountRelation": {"type": "list"}
    },
    "ThreadTag": {
      "id": "kjzl6hvfrbw6ca270wsb2s8gv3zawm73msilrf7ul1chz74xj1vpupq1lkemv4m",
      "accountRelation": {"type": "list"}
    },
    "UserCommunity": {
      "id": "kjzl6hvfrbw6c7o6v6x3p3vly2ndnh5eexrci6bo8b1qvz8mhqrhk8yxiw6jphq",
      "accountRelation": {"type": "list"}
    },
    "Vote": {
      "id": "kjzl6hvfrbw6c7wojagutwctcw41gktwuhj3dvijtxnq2omdpeojbjfhcihm8y7",
      "accountRelation": {"type": "list"}
    }
  },
  "objects": {
    "CommentSocialCommentId": {
      "commentId": {"type": "string", "required": true},
      "platformName": {"type": "string", "required": true}
    },
    "Comment": {
      "text": {"type": "string", "required": true},
      "userId": {"type": "streamid", "required": true},
      "threadId": {"type": "streamid", "required": true},
      "createdAt": {"type": "datetime", "required": true},
      "createdFrom": {"type": "string", "required": true},
      "socialCommentIds": {
        "type": "list",
        "required": true,
        "item": {"type": "reference", "refType": "object", "refName": "CommentSocialCommentId", "required": true}
      },
      "user": {
        "type": "view",
        "viewType": "relation",
        "relation": {
          "source": "document",
          "model": "kjzl6hvfrbw6c828cr9zv69x34395lnxo7g5f6uwnxlv3fnwtgho7e5o3hayx0d",
          "property": "userId"
        }
      },
      "author": {"type": "view", "viewType": "documentAccount"},
      "thread": {
        "type": "view",
        "viewType": "relation",
        "relation": {
          "source": "document",
          "model": "kjzl6hvfrbw6c85luxixex8z6bjlzli1e2obz1cptcxre5dfd1tbmip52od049x",
          "property": "threadId"
        }
      },
      "votes": {
        "type": "view",
        "viewType": "relation",
        "relation": {
          "source": "queryConnection",
          "model": "kjzl6hvfrbw6c7wojagutwctcw41gktwuhj3dvijtxnq2omdpeojbjfhcihm8y7",
          "property": "commentId"
        }
      }
    },
    "ThreadSocialThreadId": {
      "threadId": {"type": "string", "required": true},
      "platformName": {"type": "string", "required": true}
    },
    "Thread": {
      "body": {"type": "string", "required": true},
      "title": {"type": "string", "required": true},
      "userId": {"type": "streamid", "required": true},
      "createdAt": {"type": "datetime", "required": true},
      "communityId": {"type": "streamid", "required": true},
      "createdFrom": {"type": "string", "required": true},
      "socialThreadIds": {
        "type": "list",
        "required": true,
        "item": {"type": "reference", "refType": "object", "refName": "ThreadSocialThreadId", "required": true}
      },
      "user": {
        "type": "view",
        "viewType": "relation",
        "relation": {
          "source": "document",
          "model": "kjzl6hvfrbw6c828cr9zv69x34395lnxo7g5f6uwnxlv3fnwtgho7e5o3hayx0d",
          "property": "userId"
        }
      },
      "author": {"type": "view", "viewType": "documentAccount"},
      "community": {
        "type": "view",
        "viewType": "relation",
        "relation": {
          "source": "document",
          "model": "kjzl6hvfrbw6c6w86fbnft0c83g7hqscx6urkpz49bgv380hzudelk359m9q5vu",
          "property": "communityId"
        }
      },
      "comments": {
        "type": "view",
        "viewType": "relation",
        "relation": {
          "source": "queryConnection",
          "model": "kjzl6hvfrbw6c9x0v0j4keukbnyqmurnko9zknd1sj7pzfjqe1wfmpgw9rg5x1w",
          "property": "threadId"
        }
      },
      "tags": {
        "type": "view",
        "viewType": "relation",
        "relation": {
          "source": "queryConnection",
          "model": "kjzl6hvfrbw6ca270wsb2s8gv3zawm73msilrf7ul1chz74xj1vpupq1lkemv4m",
          "property": "threadId"
        }
      }
    },
    "UserPlatform": {
      "platformId": {"type": "string", "required": true},
      "platformName": {"type": "string", "required": true},
      "platformAvatar": {"type": "string", "required": true},
      "platformUsername": {"type": "string", "required": true}
    },
    "User": {
      "createdAt": {"type": "datetime", "required": true},
      "userPlatforms": {
        "type": "list",
        "required": false,
        "item": {"type": "reference", "refType": "object", "refName": "UserPlatform", "required": false}
      },
      "walletAddress": {"type": "string", "required": true},
      "author": {"type": "view", "viewType": "documentAccount"},
      "communities": {
        "type": "view",
        "viewType": "relation",
        "relation": {
          "source": "queryConnection",
          "model": "kjzl6hvfrbw6c7o6v6x3p3vly2ndnh5eexrci6bo8b1qvz8mhqrhk8yxiw6jphq",
          "property": "userId"
        }
      }
    },
    "CommunityTag": {
      "tagId": {"type": "streamid", "required": true},
      "communityId": {"type": "streamid", "required": true},
      "tag": {
        "type": "view",
        "viewType": "relation",
        "relation": {
          "source": "document",
          "model": "kjzl6hvfrbw6c9mri41w31xgzu53xca1k1y0jg0lbolkujfa4t1ilvoo3nkvffr",
          "property": "tagId"
        }
      },
      "Community": {
        "type": "view",
        "viewType": "relation",
        "relation": {
          "source": "document",
          "model": "kjzl6hvfrbw6c6w86fbnft0c83g7hqscx6urkpz49bgv380hzudelk359m9q5vu",
          "property": "communityId"
        }
      }
    },
    "Tag": {
      "tag": {"type": "string", "required": true},
      "author": {"type": "view", "viewType": "documentAccount"},
      "communities": {
        "type": "view",
        "viewType": "relation",
        "relation": {
          "source": "queryConnection",
          "model": "kjzl6hvfrbw6c7zj6mhyhon8t5ig3w8489iqvyacqvz338p7em8ft3uvu93639g",
          "property": "tagId"
        }
      },
      "threads": {
        "type": "view",
        "viewType": "relation",
        "relation": {
          "source": "queryConnection",
          "model": "kjzl6hvfrbw6ca270wsb2s8gv3zawm73msilrf7ul1chz74xj1vpupq1lkemv4m",
          "property": "tagId"
        }
      }
    },
    "Community": {
      "createdAt": {"type": "datetime", "required": true},
      "description": {"type": "string", "required": true},
      "communityName": {"type": "string", "required": true},
      "author": {"type": "view", "viewType": "documentAccount"},
      "socialPlatforms": {
        "type": "view",
        "viewType": "relation",
        "relation": {
          "source": "queryConnection",
          "model": "kjzl6hvfrbw6cb3lqz7isqv48dffi80fqxrcrbjjr8xnm4oy84gp8t3lqcfrbkl",
          "property": "communityId"
        }
      },
      "tags": {
        "type": "view",
        "viewType": "relation",
        "relation": {
          "source": "queryConnection",
          "model": "kjzl6hvfrbw6c7zj6mhyhon8t5ig3w8489iqvyacqvz338p7em8ft3uvu93639g",
          "property": "communityId"
        }
      },
      "threads": {
        "type": "view",
        "viewType": "relation",
        "relation": {
          "source": "queryConnection",
          "model": "kjzl6hvfrbw6c85luxixex8z6bjlzli1e2obz1cptcxre5dfd1tbmip52od049x",
          "property": "communityId"
        }
      },
      "users": {
        "type": "view",
        "viewType": "relation",
        "relation": {
          "source": "queryConnection",
          "model": "kjzl6hvfrbw6c7o6v6x3p3vly2ndnh5eexrci6bo8b1qvz8mhqrhk8yxiw6jphq",
          "property": "communityId"
        }
      }
    },
    "SocialPlatform": {
      "userId": {"type": "streamid", "required": true},
      "platform": {"type": "string", "required": true},
      "platformId": {"type": "string", "required": true},
      "communityId": {"type": "streamid", "required": true},
      "communityName": {"type": "string", "required": true},
      "communityAvatar": {"type": "string", "required": true},
      "user": {
        "type": "view",
        "viewType": "relation",
        "relation": {
          "source": "document",
          "model": "kjzl6hvfrbw6c828cr9zv69x34395lnxo7g5f6uwnxlv3fnwtgho7e5o3hayx0d",
          "property": "userId"
        }
      },
      "author": {"type": "view", "viewType": "documentAccount"},
      "community": {
        "type": "view",
        "viewType": "relation",
        "relation": {
          "source": "document",
          "model": "kjzl6hvfrbw6c6w86fbnft0c83g7hqscx6urkpz49bgv380hzudelk359m9q5vu",
          "property": "communityId"
        }
      }
    },
    "ThreadTag": {
      "tagId": {"type": "streamid", "required": true},
      "threadId": {"type": "streamid", "required": true},
      "tag": {
        "type": "view",
        "viewType": "relation",
        "relation": {
          "source": "document",
          "model": "kjzl6hvfrbw6c9mri41w31xgzu53xca1k1y0jg0lbolkujfa4t1ilvoo3nkvffr",
          "property": "tagId"
        }
      },
      "thread": {
        "type": "view",
        "viewType": "relation",
        "relation": {
          "source": "document",
          "model": "kjzl6hvfrbw6c85luxixex8z6bjlzli1e2obz1cptcxre5dfd1tbmip52od049x",
          "property": "threadId"
        }
      }
    },
    "UserCommunity": {
      "userId": {"type": "streamid", "required": true},
      "communityId": {"type": "streamid", "required": true},
      "user": {
        "type": "view",
        "viewType": "relation",
        "relation": {
          "source": "document",
          "model": "kjzl6hvfrbw6c828cr9zv69x34395lnxo7g5f6uwnxlv3fnwtgho7e5o3hayx0d",
          "property": "userId"
        }
      },
      "community": {
        "type": "view",
        "viewType": "relation",
        "relation": {
          "source": "document",
          "model": "kjzl6hvfrbw6c6w86fbnft0c83g7hqscx6urkpz49bgv380hzudelk359m9q5vu",
          "property": "communityId"
        }
      }
    },
    "Vote": {
      "vote": {"type": "boolean", "required": true},
      "userId": {"type": "streamid", "required": true},
      "commentId": {"type": "streamid", "required": true},
      "user": {
        "type": "view",
        "viewType": "relation",
        "relation": {
          "source": "document",
          "model": "kjzl6hvfrbw6c828cr9zv69x34395lnxo7g5f6uwnxlv3fnwtgho7e5o3hayx0d",
          "property": "userId"
        }
      },
      "comment": {
        "type": "view",
        "viewType": "relation",
        "relation": {
          "source": "document",
          "model": "kjzl6hvfrbw6c9x0v0j4keukbnyqmurnko9zknd1sj7pzfjqe1wfmpgw9rg5x1w",
          "property": "commentId"
        }
      }
    }
  },
  "enums": {},
  "accountData": {
    "commentList": {"type": "connection", "name": "Comment"},
    "threadList": {"type": "connection", "name": "Thread"},
    "user": {"type": "node", "name": "User"},
    "communityTagList": {"type": "connection", "name": "CommunityTag"},
    "tagList": {"type": "connection", "name": "Tag"},
    "communityList": {"type": "connection", "name": "Community"},
    "socialPlatformList": {"type": "connection", "name": "SocialPlatform"},
    "threadTagList": {"type": "connection", "name": "ThreadTag"},
    "userCommunityList": {"type": "connection", "name": "UserCommunity"},
    "voteList": {"type": "connection", "name": "Vote"}
  }
}