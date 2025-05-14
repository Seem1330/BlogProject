
import { Client, Databases, ID, Storage, Query , Permission, Role} from 'appwrite';
import conf from '../conf/conf';

export class DbService {
    client = new Client();
    databases;
    bucket

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl) // Your API Endpoint
            .setProject(conf.appwriteProjectId); // Your project ID

        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);

    }

    async createPost({ title, slug, content, featuredImage, status, userId }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId
                },
                 [Permission.read(Role.user(userId))],
                 [Permission.write(Role.user(userId))]
            );
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }

    }

    async updatePost(slug, { title, content, featuredImage, status }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status
                }
            );
        } catch (error) {
            console.error('Error updating post:', error);
            throw error;
        }
    }

    async deletePost(slug) {
        try {
            return await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            );
            return true;

        } catch (error) {
            console.error('Error deleting post:', error);
            return false;
        }
    }

    // get  doccument by id

    async getPostById(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            );

        } catch (error) {
            console.error('Error getting post by id:', error);
            throw error;
            return false

        }
    }

    // list
    async getAllPosts(queries = [Query.equal('status', 'active')]) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries,
                100, // limit
            );

        } catch (error) {
            console.error('Error getting all posts:', error);
            return false;
        }
    }

    // file upload service
    async uploadFile(file,userId) {
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file,
                [
                Permission.read(Role.user(userId)), // <-- this allows public preview
                Permission.write(Role.user(userId))
            ]
            );

        } catch (error) {
            console.error('Error uploading file:', error);
            //  throw error;
            return null;
        }
    }

    async deleteFile(fileId) {
        try {
            return await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true;
        } catch (error) {
            console.error('Error deleting file:', error);
            throw error;
            return false;
        }
    }

    getFilePreview(fileId) {
            if (!fileId) return '';

    try {
        const preview = this.bucket.getFileView(
            conf.appwriteBucketId,
            fileId,
            200,
            200,
            'jpeg'
        );
        return preview; // .href is correct here
    } catch (error) {
        console.error("Error generating preview URL:", error);
        return '';
    }
}

    // getFilePreview(fileId) {
    //     return this.bucket.getFilePreview(
    //         conf.appwriteBucketId,
    //         fileId,
    //         200, // width
    //         200 // height
    //       //  'jpeg' // format
    //     ).href; // IMPORTANT: convert to URL string
    // }

}
const dbService = new DbService();
export default dbService;