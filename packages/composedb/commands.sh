rm -rf gen

composedb composite:create ./schemas/User.graphql --output=gen/Composite.User.json --ceramic-url=$2 --did-private-key=$1
composedb composite:models ./gen/Composite.User.json --ceramic-url=$2
composedb composite:create ./schemas/Community.graphql --output=gen/Composite.Community.json --ceramic-url=$2 --did-private-key=$1
composedb composite:models ./gen/Composite.Community.json --ceramic-url=$2

composedb composite:create ./schemas/UserCommunity.graphql --output=gen/Composite.UserCommunity.json --ceramic-url=$2 --did-private-key=$1
composedb composite:models ./gen/Composite.UserCommunity.json --ceramic-url=$2
composedb composite:create ./schemas/usersInCommunity.graphql --output=gen/Composite.usersInCommunity.json --ceramic-url=$2 --did-private-key=$1
composedb composite:models ./gen/Composite.usersInCommunity.json --ceramic-url=$2
composedb composite:create ./schemas/communitiesInUser.graphql --output=gen/Composite.communitiesInUser.json --ceramic-url=$2 --did-private-key=$1
composedb composite:models ./gen/Composite.communitiesInUser.json --ceramic-url=$2

composedb composite:create ./schemas/SocialPlatform.graphql --output=gen/Composite.SocialPlatform.json --ceramic-url=$2 --did-private-key=$1
composedb composite:models ./gen/Composite.SocialPlatform.json --ceramic-url=$2

composedb composite:create ./schemas/PlatformsInCommunity.graphql --output=gen/Composite.PlatformsInCommunity.json --ceramic-url=$2 --did-private-key=$1
composedb composite:models ./gen/Composite.PlatformsInCommunity.json --ceramic-url=$2

composedb composite:create ./schemas/Thread.graphql --output=gen/Composite.Thread.json --ceramic-url=$2 --did-private-key=$1
composedb composite:models ./gen/Composite.Thread.json --ceramic-url=$2
composedb composite:create ./schemas/ThreadsInCommunity.graphql --output=gen/Composite.ThreadsInCommunity.json --ceramic-url=$2 --did-private-key=$1
composedb composite:models ./gen/Composite.ThreadsInCommunity.json --ceramic-url=$2

composedb composite:create ./schemas/Comments.graphql --output=gen/Composite.Comments.json --ceramic-url=$2 --did-private-key=$1
composedb composite:models ./gen/Composite.Comments.json --ceramic-url=$2
composedb composite:create ./schemas/CommentsInThread.graphql --output=gen/Composite.CommentsInThread.json --ceramic-url=$2 --did-private-key=$1
composedb composite:models ./gen/Composite.CommentsInThread.json --ceramic-url=$2

composedb composite:create ./schemas/Tag.graphql --output=gen/Composite.Tag.json --ceramic-url=$2 --did-private-key=$1
composedb composite:models ./gen/Composite.Tag.json --ceramic-url=$2
composedb composite:create ./schemas/CommunityTag.graphql --output=gen/Composite.CommunityTag.json --ceramic-url=$2 --did-private-key=$1
composedb composite:models ./gen/Composite.CommunityTag.json --ceramic-url=$2
composedb composite:create ./schemas/TagsInCommunity.graphql --output=gen/Composite.TagsInCommunity.json --ceramic-url=$2 --did-private-key=$1
composedb composite:models ./gen/Composite.TagsInCommunity.json --ceramic-url=$2
composedb composite:create ./schemas/CommunitiesInTag.graphql --output=gen/Composite.CommunitiesInTag.json --ceramic-url=$2 --did-private-key=$1
composedb composite:models ./gen/Composite.CommunitiesInTag.json --ceramic-url=$2

composedb composite:create ./schemas/ThreadTag.graphql --output=gen/Composite.ThreadTag.json --ceramic-url=$2 --did-private-key=$1
composedb composite:models ./gen/Composite.ThreadTag.json --ceramic-url=$2
composedb composite:create ./schemas/TagsInThread.graphql --output=gen/Composite.TagsInThread.json --ceramic-url=$2 --did-private-key=$1
composedb composite:models ./gen/Composite.TagsInThread.json --ceramic-url=$2
composedb composite:create ./schemas/ThreadsInTag.graphql --output=gen/Composite.ThreadsInTag.json --ceramic-url=$2 --did-private-key=$1
composedb composite:models ./gen/Composite.ThreadsInTag.json --ceramic-url=$2

composedb composite:create ./schemas/Vote.graphql --output=gen/Composite.Vote.json --ceramic-url=$2 --did-private-key=$1
composedb composite:models ./gen/Composite.Vote.json --ceramic-url=$2
composedb composite:create ./schemas/VotesInComment.graphql --output=gen/Composite.VotesInComment.json --ceramic-url=$2 --did-private-key=$1
composedb composite:models ./gen/Composite.VotesInComment.json --ceramic-url=$2

composedb composite:merge ./gen/Composite.* --output=./gen/DevNode.json --ceramic-url=$2
composedb composite:compile ./gen/DevNode.json ./gen/runtime-composite.json --ceramic-url=$2
composedb composite:compile ./gen/DevNode.json src/definition.ts --ceramic-url=$2
composedb composite:deploy ./gen/DevNode.json --ceramic-url=$2 --did-private-key=$1
composedb composite:models ./gen/DevNode.json --ceramic-url=$2
