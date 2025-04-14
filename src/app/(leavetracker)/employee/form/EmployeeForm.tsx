"use client"
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import {useForm} from "react-hook-form"
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod"
import {useAction} from "next-safe-action/hooks";
import {saveEmployeeAction} from "@/app/actions/saveEmployeeAction"
import { toast } from "sonner"; // Correct import
import { LoaderCircle } from "lucide-react";
import {DisplayServerActionResponse} from "@/components/DisplayServerActionResponse";
import { Form } from "@/components/ui/form"

import { insertEmployeeSchema,type insertEmployeeSchemaType,type selectEmployeeSchemaType

 } from "@/zod-schemas/employee"
 type Props={
    employee?:selectEmployeeSchemaType,

 }

export default function EmployeeForm({
    employee
}:Props){
    const defaultValues:insertEmployeeSchemaType={
        id:employee?.id ?? 0,
        name:employee?.name ?? '',
        email:employee?.email?? '',
        phone:employee?.phone?? '',
    }
    const form=useForm<insertEmployeeSchemaType>({
        mode:"onBlur",
        resolver:zodResolver(insertEmployeeSchema),
        defaultValues,
    })

    const {
        execute:executeSave,
        result:saveResult,
        isExecuting:isSaving,
        reset:resetSaveAction,
      }=useAction(saveEmployeeAction,{
        onSuccess({data}){
          //toast user
          toast.success(
            "Success!",{
              description:data?.message,
            }
          )
        },

    })    

    async function submitForm(data:insertEmployeeSchemaType) {
        console.log(data);
        executeSave(data);
    }

    return(
        <div className="flex flex-col gap-1 sm:px-9">
            <DisplayServerActionResponse result={saveResult}/>    
            <div>
                <h2 className="text-2xl font-bold">{employee?.id ? "Edit" : "New"} Employee {employee?.id?`#${employee.id}`:"Form"} </h2>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(submitForm)}
                className="flex flex-col sm:flex-row gap-4 sm:gap-8"
                >
                    <div className="flex flex-col gap-4 w-full max-w-xs">
                        <InputWithLabel <insertEmployeeSchemaType>
                            fieldTitle="Name"
                            nameInSchema="name"
                        />

                        <InputWithLabel <insertEmployeeSchemaType>
                            fieldTitle="Email"
                            nameInSchema="email"            
                        />

                        <InputWithLabel <insertEmployeeSchemaType>
                            fieldTitle="Phone"
                            nameInSchema="phone"
                        />
                        <div className="flex gap-2">
                            <Button 
                                    type="submit"
                                    className="w-3/4"
                                    variant="default"
                                    title="save"
                                    disabled={isSaving}
                            >
                                {
                                    isSaving?(
                                        <>
                                            <LoaderCircle className="animate-spin">Saving</LoaderCircle>
                                        </>
                                    ):"Save"
                                            }
                            </Button>
                            <Button 
                                type="button"
                                variant="destructive"
                                title="Reset"
                                onClick={()=>{
                                    form.reset(defaultValues)
                                    resetSaveAction()
                                            
                                        
                                    }}
                            >
                                Reset
                            </Button> 

                        </div>
                      

                    </div>
 
                    
                    
              
                </form>
            
            </Form>

        </div>

    )
}

