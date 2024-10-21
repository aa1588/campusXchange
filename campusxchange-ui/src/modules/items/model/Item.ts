export interface Item {
    id: number
    title: string
    quantity: number
    description: string
    price: number
    category: string
    listed_by: number
    imageUrls: string[]
    createdAt: string
    updatedAt: string | null
}
