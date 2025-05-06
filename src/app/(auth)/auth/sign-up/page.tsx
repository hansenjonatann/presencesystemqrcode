'use client'
import Image from "next/image";
import InputField from "../_components/input-field";
import Link from "next/link";
import toast from "react-hot-toast";
import { useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Loader2 } from "lucide-react";

export default function AuthSignUpPage() {
    const [name, setName] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmationPassword, setConfirmationPassword] = useState<string>('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [address, setAddress] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
  
    const pathname = usePathname();
    const router = useRouter();
  
    const signUpMutation = api.auth.signup.useMutation({
      onSuccess: () => {
        setLoading(false);
        toast.success('Registration success! Please login with your account');
        router.push('/auth/sign-in');
      },
      onError: (e) => {
        setLoading(false);
        toast.error(e.message);
        setName('');
        setUsername('');
        setPassword('');
        setConfirmationPassword('');
        setAddress('');
        setImage(null);
        setImagePreview(null);
      },
    });
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
      }
    };
  
    const handleSignUp = async (e: FormEvent) => {
      e.preventDefault();
      setLoading(true);
  
      // Validate inputs
      if (password.length < 8) {
        setLoading(false);
        toast.error('Password must be at least 8 characters!');
        return;
      }
      if (password !== confirmationPassword) {
        setLoading(false);
        toast.error('Password and confirmation do not match!');
        return;
      }
      if (!image) {
        setLoading(false);
        toast.error('Profile image is required!');
        return;
      }
  
      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = async () => {
        const base64String = reader.result?.toString();
        if (!base64String) {
          setLoading(false);
          toast.error('Failed to process image!');
          return;
        }
  
        try {
          await signUpMutation.mutateAsync({
            name,
            username,
            email,
            password,
            address: address || null,
            profile: base64String, // Send base64 string to server
          });
        } catch (error) {
          setLoading(false);
          console.log(error)
        }
      };
      reader.onerror = () => {
        setLoading(false);
        toast.error('Error reading image file!');
      };
    };
  
    return (
      <div className="mt-4 text-accent">
        <h1 className="text-center text-3xl font-bold">Presence System QR Based</h1>
        <div className="mt-36">
          <form onSubmit={handleSignUp} className="mx-8">
            <h1 className="text-center text-2xl font-bold">Create Account</h1>
            <p className="text-center mt-2 text-gray-500">
              Please enter your details to join the system!
            </p>
            <div className="mt-4 flex bg-gray-100 rounded-xl items-center w-[200px] p-2 mx-auto justify-center space-x-3">
              <Link
                className={pathname === '/auth/sign-in' ? 'bg-primary text-accent px-4 py-2 font-bold rounded-lg' : 'rounded-lg text-primary'}
                href="/auth/sign-in"
              >
                Sign In
              </Link>
              <Link
                className={pathname === '/auth/sign-up' ? 'bg-primary text-accent px-4 py-2 font-bold rounded-lg' : 'rounded-lg text-primary'}
                href="/auth/sign-up"
              >
                Sign Up
              </Link>
            </div>
  
            <div className="m-8 flex flex-col space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  placeholder="Name"
                  type="text"
                  isrequired
                  onchange={(e) => setName(e.target.value)}
                />
                <InputField
                  placeholder="Username"
                  type="text"
                  isrequired
                  onchange={(e) => setUsername(e.target.value)}
                />
                <InputField
                  placeholder="Email"
                  type="email"
                  isrequired
                  onchange={(e) => setEmail(e.target.value)}
                />
              </div>
  
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md text-accent"
              />
              {imagePreview && (
                <Image
                  src={imagePreview}
                  width={200}
                  height={200}
                  alt="Profile Preview"
                  className="object-cover rounded-md"
                />
              )}
  
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  placeholder="Password"
                  type="password"
                  isrequired
                  onchange={(e) => setPassword(e.target.value)}
                />
                <InputField
                  placeholder="Confirmation Password"
                  type="password"
                  isrequired
                  onchange={(e) => setConfirmationPassword(e.target.value)}
                />
              </div>
  
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md placeholder:text-accent text-accent"
                placeholder="Address"
                onChange={(e) => setAddress(e.target.value)}
              />
  
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-lg shadow-xl bg-secondary text-accent font-bold disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin mr-2" />
                    <p className="text-sm">Loading...</p>
                  </div>
                ) : (
                  'Sign Up'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }