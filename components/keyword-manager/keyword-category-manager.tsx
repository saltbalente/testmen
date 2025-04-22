"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Edit2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Category {
  id: string
  name: string
  description?: string
  color?: string
}

interface KeywordCategoryManagerProps {
  categories: Category[]
  categoryCounts: Record<string, number>
  onCreate: (category: Partial<Category>) => void
  onUpdate: (category: Category) => void
  onDelete: (categoryId: string) => void
}

export default function KeywordCategoryManager({
  categories,
  categoryCounts,
  onCreate,
  onUpdate,
  onDelete,
}: KeywordCategoryManagerProps) {
  const [localCategories, setLocalCategories] = useState<Category[]>(categories)
  const [newCategory, setNewCategory] = useState<Partial<Category>>({})
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    setLocalCategories(categories)
  }, [categories])

  const handleAddCategory = () => {
    if (newCategory.name) {
      const category: Category = {
        id: Date.now().toString(),
        name: newCategory.name,
        description: newCategory.description || "",
        color: newCategory.color || "#" + Math.floor(Math.random() * 16777215).toString(16),
      }
      onCreate(category)
      setNewCategory({})
      setIsDialogOpen(false)
    }
  }

  const handleUpdateCategory = () => {
    if (editingCategory && editingCategory.name) {
      onUpdate(editingCategory)
      setEditingCategory(null)
      setIsDialogOpen(false)
    }
  }

  const handleDeleteCategory = (id: string) => {
    onDelete(id)
  }

  const startEditing = (category: Category) => {
    setEditingCategory(category)
    setIsDialogOpen(true)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Keyword Categories</CardTitle>
        <CardDescription>Manage your keyword categories</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-2">
            {localCategories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center gap-2">
                  <Badge style={{ backgroundColor: category.color }}>{category.name}</Badge>
                  <Badge variant="outline" className="text-xs">
                    {categoryCounts[category.name] || 0}
                  </Badge>
                  {category.description && (
                    <span className="text-sm text-muted-foreground">{category.description}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => startEditing(category)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(category.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
              <DialogDescription>
                {editingCategory ? "Update the category details below." : "Enter the details for your new category."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={editingCategory ? editingCategory.name : newCategory.name || ""}
                  onChange={(e) => {
                    if (editingCategory) {
                      setEditingCategory({ ...editingCategory, name: e.target.value })
                    } else {
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                  }}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={editingCategory ? editingCategory.description : newCategory.description || ""}
                  onChange={(e) => {
                    if (editingCategory) {
                      setEditingCategory({ ...editingCategory, description: e.target.value })
                    } else {
                      setNewCategory({ ...newCategory, description: e.target.value })
                    }
                  }}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="color" className="text-right">
                  Color
                </Label>
                <div className="col-span-3 flex gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={editingCategory ? editingCategory.color : newCategory.color || "#000000"}
                    onChange={(e) => {
                      if (editingCategory) {
                        setEditingCategory({ ...editingCategory, color: e.target.value })
                      } else {
                        setNewCategory({ ...newCategory, color: e.target.value })
                      }
                    }}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={editingCategory ? editingCategory.color : newCategory.color || "#000000"}
                    onChange={(e) => {
                      if (editingCategory) {
                        setEditingCategory({ ...editingCategory, color: e.target.value })
                      } else {
                        setNewCategory({ ...newCategory, color: e.target.value })
                      }
                    }}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false)
                  setEditingCategory(null)
                  setNewCategory({})
                }}
              >
                Cancel
              </Button>
              <Button onClick={editingCategory ? handleUpdateCategory : handleAddCategory}>
                {editingCategory ? "Update" : "Add"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}
