import { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { withAuth } from '@/hocs';
import { clearCache } from '@/api/cache';

const Header = lazy(() => import('@/components/Header'));
const TextField = lazy(() => import('@/components/ui/TextField'));
const Button = lazy(() => import('@/components/ui/Button'));
const Select = lazy(() => import('@/components/ui/Select'));
const ShelterServices = lazy(() => import('@/service/ShelterServices'));
const useFormik = lazy(() => import('formik'));
const Yup = lazy(() => import('yup'));

const CreateShelterComponent = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      address: '',
      shelteredPeople: 0,
      capacity: 0,
      verified: false,
      petFriendly: false,
      contact: null,
      pix: null,
    },
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: false,
    validateOnMount: false,
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Este campo deve ser preenchido'),
      address: Yup.string().required('Este campo deve ser preenchido'),
      shelteredPeople: Yup.number()
        .min(0, 'O valor mínimo para este campo é 0')
        .nullable(),
      capacity: Yup.number()
        .min(1, 'O valor mínimo para este campo é 1')
        .nullable(),
      petFriendly: Yup.bool().nullable(),
      contact: Yup.string().nullable(),
      pix: Yup.string().nullable(),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await ShelterServices.create(values);
        clearCache(false);
        toast({
          title: 'Cadastro feita com sucesso',
        });
        resetForm();
      } catch (err: any) {
        toast({
          variant: 'destructive',
          title: 'Ocorreu um erro ao tentar cadastrar',
          description: `${err?.response?.data?.message ?? err}`,
        });
      }
    },
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col h-screen items-center">
        <Header
          title="Cadastrar novo abrigo"
          className="bg-white [&_*]:text-zinc-800 border-b-[1px] border-b-border"
          startAdornment={
            <Button
              variant="ghost"
              className="[&_svg]:stroke-blue-500"
              onClick={() => navigate('/')}
            >
              <ChevronLeft size={20} />
            </Button>
          }
        />
        <div className="p-4 flex flex-col max-w-5xl w-full gap-3 items-start h-full">
          <form className="contents" onSubmit={formik.handleSubmit}>
            <h6 className="text-2xl font-semibold">Cadastrar novo abrigo</h6>
            <p className="text-muted-foreground">
              Adicione as informações necessarias para o cadastro do novo abrigo.
            </p>
            <div className=" flex flex-col max-w-5xl w-full gap-2 items-start">
              <TextField
                label="Nome do abrigo"
                {...formik.getFieldProps('name')}
                error={!!formik.errors.name}
                helperText={formik.errors.name}
              />
              {/* Other form fields */}
            </div>
            <div className="flex flex-1 flex-col justify-end md:justify-start w-full py-6">
              <Button
                loading={formik.isSubmitting}
                type="submit"
                className="flex gap-2 text-white font-medium text-lg bg-blue-500 hover:bg-blue-600 w-full"
              >
                Cadastrar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Suspense>
  );
};

const CreateShelter = withAuth(CreateShelterComponent);

export { CreateShelter };
