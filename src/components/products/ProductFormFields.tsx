import type { Control, FieldValues, Path } from 'react-hook-form';
import { Package, DollarSign, FileText, FolderOpen } from 'lucide-react';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ImageDropzone } from './ImageDropzone';
import type { Category } from '@/types/products';

// ============================================
// SHARED FORM FIELD COMPONENTS
// ============================================

interface BaseFieldProps<T extends FieldValues> {
    control: Control<T>;
    isLoading?: boolean;
}

// Name Field Component
interface NameFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
    name: Path<T>;
}

export function NameField<T extends FieldValues>({
    control,
    name,
    isLoading
}: NameFieldProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Nombre del Producto</FormLabel>
                    <FormControl>
                        <div className="relative group">
                            <Package className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Ej: Hamburguesa con queso"
                                className="pl-9 h-11"
                                disabled={isLoading}
                                {...field}
                            />
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

// Price Field Component
interface PriceFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
    name: Path<T>;
}

export function PriceField<T extends FieldValues>({
    control,
    name,
    isLoading
}: PriceFieldProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl>
                        <div className="relative group">
                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                className="pl-9 h-11"
                                disabled={isLoading}
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                value={field.value || ''}
                            />
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

// Description Field Component
interface DescriptionFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
    name: Path<T>;
}

export function DescriptionField<T extends FieldValues>({
    control,
    name,
    isLoading
}: DescriptionFieldProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                        <div className="relative group">
                            <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Describe el producto..."
                                className="pl-9 h-11"
                                disabled={isLoading}
                                {...field}
                            />
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

// Category Field Component
interface CategoryFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
    name: Path<T>;
    categories: Category[];
}

export function CategoryField<T extends FieldValues>({
    control,
    name,
    categories,
    isLoading
}: CategoryFieldProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value ? field.value.toString() : ''}
                        disabled={isLoading}
                    >
                        <FormControl>
                            <SelectTrigger className="h-11">
                                <div className="flex items-center gap-2">
                                    <FolderOpen className="h-4 w-4 text-muted-foreground" />
                                    <SelectValue placeholder="Selecciona una categoría" />
                                </div>
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category.idCategory} value={category.idCategory.toString()}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

// Image Field Component
interface ImageFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
    name: Path<T>;
    preview?: string | null;
    onImageChange: (file: File | undefined) => void;
    showNewImageMessage?: boolean;
}

export function ImageField<T extends FieldValues>({
    control,
    name,
    preview,
    onImageChange,
    isLoading,
    showNewImageMessage = false,
}: ImageFieldProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field: { onChange } }) => (
                <FormItem>
                    <FormLabel>Imagen del Producto</FormLabel>
                    <FormControl>
                        <ImageDropzone
                            onFileSelect={(file) => {
                                onImageChange(file);
                                onChange(file);
                            }}
                            preview={preview}
                            disabled={isLoading}
                        />
                    </FormControl>
                    <FormDescription>
                        {showNewImageMessage
                            ? 'Nueva imagen seleccionada. Se actualizará al guardar.'
                            : 'Arrastra una imagen o haz clic para seleccionar. Formato: JPG, PNG o WEBP. Tamaño máximo: 20MB'}
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

// Active Status Field Component
interface ActiveFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
    name: Path<T>;
}

export function ActiveField<T extends FieldValues>({
    control,
    name,
    isLoading
}: ActiveFieldProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <FormLabel className="text-base">Estado del Producto</FormLabel>
                        <FormDescription>
                            Activar o desactivar el producto en el sistema.
                        </FormDescription>
                    </div>
                    <FormControl>
                        <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                            aria-label="Toggle product status"
                        />
                    </FormControl>
                </FormItem>
            )}
        />
    );
}
