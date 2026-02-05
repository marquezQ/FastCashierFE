import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { updateProductSchema, type UpdateProductFormValues } from '@/schemas/products.schema';
import type { Category, Product } from '@/types/products';
import {
  CodeField,
  NameField,
  PriceField,
  DescriptionField,
  CategoryField,
  ImageField,
  ActiveField,
} from './ProductFormFields';

interface EditProductFormProps {
  product: Product;
  categories: Category[];
  onSubmit: (data: UpdateProductFormValues) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export const EditProductForm = ({
  product,
  categories,
  onSubmit,
  isLoading,
  onCancel,
}: EditProductFormProps) => {
  // Encontrar la categoría del producto
  const productCategory = categories.find((cat) =>
    cat.products.some((p) => p.idProduct === product.idProduct)
  );
  const initialCategoryId = productCategory?.idCategory;

  // Usar la imagen actual o null
  const currentImageUrl = product.imageUrl || null;
  const [imagePreview, setImagePreview] = useState<string | null>(currentImageUrl);
  const [newImageFile, setNewImageFile] = useState<File | undefined>(undefined);

  const form = useForm<UpdateProductFormValues>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      code: product.code,
      name: product.name,
      price: parseFloat(product.price),
      description: product.description,
      idCategory: initialCategoryId,
      image: undefined,
      isActive: product.isActive,
    },
  });

  // Actualizar valores cuando cambie el producto
  useEffect(() => {
    const category = categories.find((cat) =>
      cat.products.some((p) => p.idProduct === product.idProduct)
    );
    const categoryId = category?.idCategory;

    form.reset({
      code: product.code,
      name: product.name,
      price: parseFloat(product.price),
      description: product.description,
      idCategory: categoryId,
      image: undefined,
      isActive: product.isActive,
    });

    const imageUrl = product.imageUrl || null;
    setImagePreview(imageUrl);
    setNewImageFile(undefined);
  }, [product, categories, form]);

  const handleSubmit = async (data: UpdateProductFormValues) => {
    // Filtrar solo los campos que realmente cambiaron
    const cleanedData: UpdateProductFormValues = {};

    if (data.code !== undefined && data.code !== product.code) {
      cleanedData.code = data.code;
    }
    if (data.name !== undefined && data.name !== product.name) {
      cleanedData.name = data.name;
    }
    if (data.price !== undefined && data.price !== parseFloat(product.price)) {
      cleanedData.price = data.price;
    }
    if (data.description !== undefined && data.description !== product.description) {
      cleanedData.description = data.description;
    }
    if (data.idCategory !== undefined) {
      const productCategory = categories.find((cat) =>
        cat.products.some((p) => p.idProduct === product.idProduct)
      );
      if (productCategory && data.idCategory !== productCategory.idCategory) {
        cleanedData.idCategory = data.idCategory;
      }
    }
    if (data.isActive !== undefined && data.isActive !== product.isActive) {
      cleanedData.isActive = data.isActive;
    }

    // Si hay nueva imagen, incluirla
    if (newImageFile) {
      cleanedData.image = newImageFile;
    } else if (imagePreview === null && product.imageUrl) {
      // Si se eliminó la imagen (X) y el producto tenía una, indicar al backend
      cleanedData.imageUrl = '';
    }

    // Si no hay cambios, no hacer nada
    if (Object.keys(cleanedData).length === 0) {
      return;
    }

    await onSubmit(cleanedData);
  };

  const handleImageChange = (file: File | undefined) => {
    if (file) {
      setNewImageFile(file);
      form.setValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // Usuario hizo clic en X - limpiar todo
      setNewImageFile(undefined);
      form.setValue('image', undefined);
      setImagePreview(null);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <CodeField control={form.control} name="code" isLoading={isLoading} />

        <NameField control={form.control} name="name" isLoading={isLoading} />

        <PriceField control={form.control} name="price" isLoading={isLoading} />

        <DescriptionField control={form.control} name="description" isLoading={isLoading} />

        <CategoryField
          control={form.control}
          name="idCategory"
          categories={categories}
          isLoading={isLoading}
        />

        <ImageField
          control={form.control}
          name="image"
          preview={imagePreview}
          onImageChange={handleImageChange}
          isLoading={isLoading}
          showNewImageMessage={!!newImageFile}
        />

        <ActiveField control={form.control} name="isActive" isLoading={isLoading} />

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar Cambios'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
