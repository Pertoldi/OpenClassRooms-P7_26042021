export class Post {
	constructor(public userId: number,
		public firtName: string,
		public lastName: string,
		public userUrl: string = '',
		public date: Date,
		public title: string,
		public postUrl: string,
		public description: string,
		public likes: number = 0,
		public postId: number
	) { }
}