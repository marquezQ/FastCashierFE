import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, Settings2, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  displayConfigSchema,
  DEFAULT_DISPLAY_VALUES,
  type DisplayConfigFormValues,
} from '@/schemas/display.schema';
import { TRANSITION_OPTIONS } from '@/constants/display';
import type { DisplayConfig, TransitionType } from '@/types/display';
import type { Category } from '@/types/products';

// ============================================
// MODAL UNIFICADO — CREAR / EDITAR PANTALLA
// ============================================

interface DisplayConfigFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: DisplayConfig | null; // null = modo crear
  categories?: Category[];
  isPending: boolean;
  onSubmit: (data: DisplayConfigFormValues) => void;
}

export const DisplayConfigFormModal = ({
  open,
  onOpenChange,
  config,
  categories,
  isPending,
  onSubmit,
}: DisplayConfigFormModalProps) => {
  const isEditMode = config !== null;

  const form = useForm<DisplayConfigFormValues>({
    resolver: zodResolver(displayConfigSchema),
    defaultValues: DEFAULT_DISPLAY_VALUES,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = form;

  // Reset form when modal opens or config changes
  useEffect(() => {
    if (open) {
      reset(
        config
          ? {
              name: config.name,
              categoryId: config.categoryId,
              rotationInterval: config.rotationInterval,
              transitionType: config.transitionType,
              showPrices: config.showPrices,
              showDescriptions: config.showDescriptions,
              productsPerSlide: config.productsPerSlide,
              isActive: config.isActive,
            }
          : DEFAULT_DISPLAY_VALUES
      );
    }
  }, [open, config, reset]);

  const handleFormSubmit = handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 dark:bg-primary/20 p-2.5">
              {isEditMode ? (
                <Settings2 className="size-5 text-primary" />
              ) : (
                <Plus className="size-5 text-primary" />
              )}
            </div>
            <div>
              <DialogTitle className="font-bold text-base tracking-tight">
                {isEditMode ? `Editar — ${config.name}` : 'Nueva Pantalla'}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {isEditMode
                  ? 'Ajusta el contenido y presentación de esta pantalla'
                  : 'Configura una nueva pantalla para tu menú digital'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleFormSubmit} className="space-y-5">
            {/* ========== Nombre + Estado ========== */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Nombre de pantalla
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Pantalla principal"
                        className="h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between rounded-xl border border-border/40 bg-muted/30 px-4 py-3 h-full">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Estado
                        </p>
                        <p className="text-sm font-bold">
                          {field.value ? 'Activa' : 'Inactiva'}
                        </p>
                      </div>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* ========== Categoría ========== */}
            <FormField
              control={control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Categoría a mostrar
                  </FormLabel>
                  <Select
                    value={field.value?.toString() ?? 'all'}
                    onValueChange={(val) =>
                      field.onChange(val === 'all' ? null : parseInt(val))
                    }
                  >
                    <FormControl>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">Todo el Menú</SelectItem>
                      {categories?.map((cat) => (
                        <SelectItem
                          key={cat.idCategory}
                          value={cat.idCategory.toString()}
                        >
                          {cat.name}
                          {cat.productCount
                            ? ` (${cat.productCount} productos)`
                            : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* ========== Transición + Intervalo + Productos ========== */}
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={control}
                name="transitionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Tipo de transición
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(val) =>
                        field.onChange(val as TransitionType)
                      }
                    >
                      <FormControl>
                        <SelectTrigger className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TRANSITION_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="rotationInterval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Rotación (segundos)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={3}
                        max={60}
                        className="h-10"
                        {...field}
                        value={Number.isNaN(field.value) ? '' : field.value}
                        onChange={(e) => {
                          const val =
                            e.target.value === ''
                              ? NaN
                              : Number(e.target.value);
                          field.onChange(val);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="productsPerSlide"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Productos por slide
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={6}
                        className="h-10"
                        {...field}
                        value={Number.isNaN(field.value) ? '' : field.value}
                        onChange={(e) => {
                          const val =
                            e.target.value === ''
                              ? NaN
                              : Number(e.target.value);
                          field.onChange(val);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ========== Toggles ========== */}
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                control={control}
                name="showPrices"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between rounded-xl border border-border/40 bg-muted/20 px-4 py-3">
                      <div>
                        <p className="text-sm font-bold">Mostrar precios</p>
                        <p className="text-xs text-muted-foreground">
                          Muestra el precio debajo de cada producto
                        </p>
                      </div>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="showDescriptions"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between rounded-xl border border-border/40 bg-muted/20 px-4 py-3">
                      <div>
                        <p className="text-sm font-bold">
                          Mostrar descripciones
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Muestra la descripción del producto
                        </p>
                      </div>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* ========== Footer ========== */}
            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={(!isDirty && isEditMode) || isPending}
              >
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                {isEditMode ? 'Guardar' : 'Crear Pantalla'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
