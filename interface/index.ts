export interface Links {
    next: string
    previous: any
}

export interface Sizes {
    thumb_24: string
    thumb_256: string
}

export interface TagMetaSchema {

}

export interface PostMetaSchema {

}
export interface TagSchema {
    id: number
    updated: string
    created: string
    db_status: number
    name: string
    id_string: string
    title: string
    desc: string
    meta: TagMetaSchema
    type: string
    path: string
}


export interface PostSchema {
    id: number
    sizes: Sizes
    updated: string
    created: string
    db_status: number
    name: string
    id_string: string
    title: string
    desc: string
    meta: any
    path: string
    taxonomies: TagSchema[]
}

export interface ResponseTagSchema {
    instance: any
    properties: any[]
    links: Links
    count: number
    page_size: number
    num_pages: number
    results: TagSchema[]
}

export interface ResponsePostSchema {
    instance: any
    properties: any[]
    links: Links
    count: number
    page_size: number
    num_pages: number
    results: PostSchema[]
}
