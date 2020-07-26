const graphql = require('graphql');
const Thought = require('../models/thought');
const Tag = require('../models/tag');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const ThoughtType = new GraphQLObjectType({
    name: 'Thought',
    fields: ( ) => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        copy: { type: GraphQLString },
        month: { type: GraphQLInt },
        year: { type: GraphQLInt },
        tag: {
            type: TagType,
            resolve(parent, args){
                return Tag.findById(parent.tagId);
            }
        }
    })
});

const TagType = new GraphQLObjectType({
    name: 'Tag',
    fields: ( ) => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        Thoughts: {
            type: new GraphQLList(ThoughtType),
            resolve(parent, args){
                return Thought.find({ tagId: parent.id });
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        thought: {
            type: ThoughtType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Thought.findById(args.id);
            }
        },
        tag: {
            type: TagType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Tag.findById(args.id);
            }
        },
        thoughts: {
            type: new GraphQLList(ThoughtType),
            resolve(parent, args){
                return Thought.find({});
            }
        },
        tags: {
            type: new GraphQLList(TagType),
            resolve(parent, args){
                return Tag.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addTag: {
            type: TagType,
            args: {
                name: { type: GraphQLString }
            },
            resolve(parent, args){
                let tag = new Tag({
                    name: args.name
                });
                return tag.save();
            }
        },
        addThought: {
            type: ThoughtType,
            args: {
                title: { type: new GraphQLNonNull(GraphQLString) },
                copy: { type: new GraphQLNonNull(GraphQLString) },
                month: { type: new GraphQLNonNull(GraphQLInt) },
                year: { type: new GraphQLNonNull(GraphQLInt) },
                tagId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args){
                let thought = new Thought({
                    title: args.title,
                    copy: args.copy,
                    month: args.month,
                    year: args.year,
                    tagId: args.tagId
                });
                return thought.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});