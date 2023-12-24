"use client";

import { useForm } from "react-hook-form";
import { Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle } from "../ui/dialog";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form,FormControl,FormField,FormItem,FormLabel,FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";   


import { FileUpload } from "../file-upload";


import axios from "axios";
import {useRouter} from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";

const formSchema=z.object({
    name:z.string().min(1,{
        message:"server name is required."
    }),
    imageUrl:z.string().min(1,{
        message:"Server image is required."
    })
});


export const CreateServerModal=() => {
    
 
    const router=useRouter();
    
    const {isOpen,onClose,type}=useModal();

    const isModalOpen=isOpen && type==="createServer"

    const form=useForm({
        resolver:zodResolver(formSchema),
        defaultValues:{
            name:"",
            imageUrl:"",
        }
    })
    const isLoadding=form.formState.isSubmitting;
    const onSubmit=async (values: z.infer<typeof formSchema>)=>{
        try{
           await axios.post("/api/servers",values);
           form.reset();
           router.refresh();
           
        }catch(error){
          console.log(error);
          
        }
        console.log(values);
    }


const handleClose=()=>{
    form.reset();
    onClose();
}

    
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
           <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold">
                Customize your server
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
                Give your server a personality with a name and an image.You can always change it later.
            </DialogDescription>

           </DialogHeader>
           <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
             <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                
                  <FormField
                    
                   control={form.control}
                   name="imageUrl"
                   render={({field})=>(
                    <FormItem>
                        <FormControl>
                            <FileUpload
                            endpoint="serverImage"
                            value={field.value}
                            onChange={field.onChange}
                            />
                        </FormControl>
                    </FormItem>
                   )}

                  />


                </div>  
                <FormField
                control={form.control}
                name="name"
                render={({field})=>(
                    <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                     Server Name
                    </FormLabel>
                    <FormControl>
                        <Input 
                        disabled={isLoadding}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter Server Name"
                        autoComplete="off"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage/>
                    </FormItem>
                )}
                />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
             <Button variant="primary" disabled={isLoadding}>
              Create    
            </Button>    
            </DialogFooter>   
            </form> 
           </Form>
      </DialogContent>

    </Dialog>

  )
}
