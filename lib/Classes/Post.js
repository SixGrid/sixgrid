const EventEmitter = require('events');
const Helpers = require('./Helpers')

/**
 * @extends node:events
 */
class Post extends EventEmitter {
	/**
	 * @param {Client} client 
	 * @param {int} post_id 
	 * @param {SearchInstance|Pool|PostGroup} parent 
	 */
	constructor(client, post_id, parent) {
		super();
		this.#data.id = post_id;
		this.Client = client;
		this.Parent = parent;

		let self = this;
		this.on('updateasync', () => {self._Update()})
		this.on('update', async () => {
			await self._Update();
		})
	}

	async _Update() {
		let res = await this.Client.WebClient.get(`/posts.json?id=${this.#data.id}`);
		if (res.data == undefined) {
			this.#data = res.data.post;
			this._Format(this.#data);
			this.emit('done', 'update');
		} else {
			this.emit('error', {message: `Failed to update`, error: res.error})
		}
	}

	_Format(data) {
		this.#data.id = data.id;

		this.Pools = [];
		for (let i = 0; i < data.pools.length; i++) {
			this.Pools.push(new Pool(this.Client, data.pools[i]));
		}
		this.Approver = new User(this.Client, data.approver_id);
		this.Uploader = new User(this.Client, data.uploader_id);

		if (data.relationships.has_children) {
			this.Children = [];
			for (let i = 0; i < data.relationships.children.length; i++) {
				this.Children.push(new Post(this.Client, data.relationships.children[i], this));
			}
		}
	}

	/**
	 * Protected Post Data
	 * @type {type$e621API.PostGet}
	 * @private
	 */
	#data = { }

	/**
	 * @type {int}
	 * @readonly
	 */
	get ID() { return this.#data.id; }
	set ID(v) {}

	/**
	 * @type {Date}
	 * @readonly
	 */
	get createdAt() { return new Date(this.#data.created_at); }
	set createdAt(v) {}
	/**
	 * @type {Date}
	 * @readonly
	 */
	get updatedAt() { return new Date(this.#data.updated_at); }
	set updatedAt(v) {}

	/**
	 * @typedef {Object}
	 */
	Image = {
		/**
		 * @type {type$e621API.FileFull}
		 * @readonly
		 */
		get File() {return this.#data.file},
		set File(v) {},
		/**
		 * @type {type$e621API.FilePreview}
		 * @readonly
		 */
		get Preview() {return this.#data.preview},
		set Preview(v) {},
		/**
		 * @type {type$e621API.FileSample}
		 * @readonly
		 */
		get Sample() {return this.#data.sample},
		set Sample(v) {},
	}

	/**
	 * @type {type$e621API.Score}
	 * @readonly
	 */
	Score = {
		up: 0,
		down: 0,
		get total() { return this.Score.up + this.Score.down; },
		set total(v) {}
	};
	Score_Self = null;

	/**
	 * @param {boolean} score=0 `true`: Vote Up<br>`false`: Vote Down
	 * @param {boolean} no_unvote=true
	 * @async
	 */
	async Vote(score, no_unvote) {
		if (score == undefined || typeof score != "number") score = 0;
		if (no_unvote == undefined || typeof no_unvote != "boolean") no_unvote = true;

		// Failsafe for really stupid programmers.
		if (score < -1) score = -1;
		if (score > 1) score = 1;

		let response = await this.Client.WebClient.post(`/posts/${this.ID}/votes.json`, `score=${score}&no_unvote=${score ? 'true': 'false'}`);
		if (response.error) throw response.error;

		this.Score.up = response.data.up;
		this.Score.down = response.data.down;
		this.Score_Self = response.data.our_score;

		return response.data;
	}

	/**
	 * @type {type$e621API.Tags}
	 * @readonly
	 */
	Tags = {
		get general() {return this.#data.tags.general || []},
		set general(v) {},
		get species() {return this.#data.tags.species || []},
		set species(v) {},
		get character() {return this.#data.tags.character || []},
		set character(v) {},
		get artist() {return this.#data.tags.artist || []},
		set artist(v) {},
		get invalid() {return this.#data.tags.invalid || []},
		set invalid(v) {},
		get lore() {return this.#data.tags.lore || []},
		set lore(v) {},
		get meta() {return this.#data.tags.meta || []},
		set meta(v) {},
	}

	/**
	 * @type {type$e621API.Flags}
	 * @readonly
	 */
	Flags = {
		get pending() {return this.#data.flags.pending}, 				set pending(v) {},
		get flagged() {return this.#data.flags.flagged}, 				set flagged(v) {},
		get note_locked() {return this.#data.flags.note_locked}, 		set note_locked(v) {},
		get status_locked() {return this.#data.flags.status_locked}, 	set status_locked(v) {},
		get rating_locked() {return this.#data.flags.rating_locked}, 	set rating_locked(v) {},
		get deleted() {return this.#data.flags.deleted}, 				set deleted(v) {},
	};

	/**
	 * @type {type$e621API.Rating}
	 * @readonly
	 */
	get Rating() {return this.#data.rating || "s"}
	set Rating(v) {}

	/**
	 * @type {int}
	 * @default 0
	 * @readonly
	 */
	get Favorites() {return this.#data.fav_count || 0}
	set Favorites(v) {}

	/**
	 * @type {boolean}
	 * @default false
	 */
	get Favorite() {return this.#data.is_favorited || false}
	set Favorite(v) {
		if (typeof v != "boolean") throw new Error("Invalid type, must be boolean.");
		this.#data.is_favorited = v;
		let self = this;
		this.Client.Favorite(this.id, v).then(() => {self.emit('updateasync')});
	}

	/**
	 * @type {Pool[]}
	 * @readonly
	 */
	Pools = [];

	/**
	 * @type {Post[]}
	 * @readonly
	 */
	Children = [];

	/**
	 * @type {User}
	 * @readonly
	 * @default null
	 */
	Approver = null;

	/**
	 * @type {User}
	 * @readonly
	 * @default null
	 */
	Uploader = null;

	/**
	 * @type {string}
	 * @default 
	 * @readonly
	 */
	get Description() {return this.#data.description || ""}
	set Description(v) {}

	/**
	 * @type {string[]}
	 * @readonly
	 */
	get Sources() {return this.#data.sources || []}
	set Sources(v) {}
}
module.exports = Post;