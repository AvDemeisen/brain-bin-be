const graphql = require('graphql');
const Thought = require('../models/thought');
const Tag = require('../models/tag');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const ThoughtType = new GraphQLObjectType({
    name: 'Thought',
    fields: ( ) => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        copy: { type: GraphQLString },
        tags: {
            type: new GraphQLList(TagType),
            resolve(parent, args){
                return Tag.find( {_id: {$in: parent.tagIds}} );
            }
        }
    })
});

const TagType = new GraphQLObjectType({
    name: 'Tag',
    fields: ( ) => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        thoughts: {
            type: new GraphQLList(ThoughtType),
            resolve(parent, args){
                return Thought.find({ tagIds: parent.id });
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
        multipleTags: {
            type: new GraphQLList(TagType),
            args: { ids: { type: new GraphQLList(GraphQLID) } },
            resolve(parent, args) {
                return Tag.find( {_id: {$in: args.ids}} );
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
        },
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
                tagIds: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))) }
            },
            resolve(parent, args){
                let thought = new Thought({
                    title: args.title,
                    copy: args.copy,
                    tagIds: args.tagIds
                });
                return thought.save();
            }
        },
        removeThought: {
            type: ThoughtType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Thought.findByIdAndDelete(args.id);
            }
        },
        updateThought: {
            type: ThoughtType,
            args: { 
                id: { type: new GraphQLNonNull(GraphQLID) },  
                title: { type: new GraphQLNonNull(GraphQLString) },
                copy: { type: new GraphQLNonNull(GraphQLString) },
                tagIds: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))) }  
            },
            resolve(parent, args){
                return Thought.findByIdAndUpdate(
                    {"_id": args.id},
                    { "$set":{
                        title: args.title,
                        copy: args.copy,
                        tagIds: args.tagIds
                    }},
                    {"new": true}
                )
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});