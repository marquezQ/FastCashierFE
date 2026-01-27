import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { createProductSchema, type CreateProductFormValues } from '@/schemas/products.schema';
import type { Category } from '@/types/products';
import {
  CodeField,
  NameField,
  PriceField,
  DescriptionField,
  CategoryField,
  ImageField,
  ActiveField,
} from './ProductFormFields';

interface CreateProductFormProps {
  categories: Category[];
  defaultCategoryId?: number;
  onSubmit: (data: CreateProductFormValues) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export const CreateProductForm = ({
  categories,
  defaultCategoryId,
  onSubmit,
  isLoading,
  onCancel,
}: CreateProductFormProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      code: '',
      name: '',
      price: 0,
      description: '',
      idCategory: defaultCategoryId,
      image: undefined,
      isActive: true as boolean,
    },
  });

  // Actualizar categoría cuando cambie el defaultCategoryId
  useEffect(() => {
    if (defaultCategoryId) {
      form.setValue('idCategory', defaultCategoryId);
    }
  }, [defaultCategoryId, form]);

  const handleSubmit = async (data: CreateProductFormValues) => {
    await onSubmit(data);
    form.reset();
    setImagePreview(null);
  };

  const handleImageChange = (file: File | undefined) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
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
                Creando...
              </>
            ) : (
              'Crear Producto'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
