"use client"

import { SelectWithLabel } from "@/components/inputs/SelectWithLabel";
import { InputTimeWithLabel } from "@/components/inputs/InputTimeWithLabel";
import {useForm} from "react-hook-form"
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod"
import {useAction} from "next-safe-action/hooks";
import {saveTrackerAction} from "@/app/actions/saveTrackerAction"
import { toast } from "sonner"; // Correct import
import {type selectEmployeeSchemaType } from "@/zod-schemas/employee";
import {type selectTrackerTypeSchemaType } from "@/zod-schemas/trackertype";
import { LoaderCircle } from "lucide-react";
import {DisplayServerActionResponse} from "@/components/DisplayServerActionResponse";
import { Form } from "@/components/ui/form"

import { insertTrackerSchema,type insertTrackerSchemaType,type selectTrackerSchemaType

 } from "@/zod-schemas/tracker"
 type Props={
    employee?:selectEmployeeSchemaType,
    tracker?:selectTrackerSchemaType,
    trackertypes?:selectTrackerTypeSchemaType,
    type:DataObj[],
    employeeName:DataObj[],
 }

export default function TicketForm({
    tracker,type,employeeName
}:Props){
    const defaultValues:insertTrackerSchemaType={
        id:tracker?.id ?? "(New)",
        employeeId:tracker?.employeeId ?? 0 ,
        trackertypeId:tracker?.trackertypeId?? 0,
        leaveTime: tracker?.leaveTime ? tracker.leaveTime.slice(0, 5) : '', // "13:30:00" -> "13:30"
        }
    const form=useForm<insertTrackerSchemaType>({
        mode:"onBlur",
        resolver:zodResolver(insertTrackerSchema),
        defaultValues,
    })

    const {
        execute:executeSave,
        result:saveResult,
        isExecuting:isSaving,
        reset:resetSaveAction,
      }=useAction(saveTrackerAction,{
        onSuccess({data}){
          //toast user
          toast.success(
            "Success!",{
              description:data?.message,
            }
          )
        },
    })    

    async function submitForm(data:insertTrackerSchemaType) {
        executeSave(data);
    }

    return(
        <div className="flex flex-col gap-1 sm:px-9">
            <DisplayServerActionResponse result={saveResult}/>    
            <div>
                <h2 className="text-2xl font-bold">{tracker?.id ? "Edit" : "New"} Leave Tracker {tracker?.id?`#${tracker.id}`:"Form"} </h2>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(submitForm)}
                className="flex flex-col sm:flex-row gap-4 sm:gap-8"
                >
                    <div className="flex flex-col gap-4 w-full max-w-xs">
                        <SelectWithLabel <insertTrackerSchemaType>
                            fieldTitle="Name"
                            nameInSchema="employeeId"
                            data={employeeName}
                        />
                        <SelectWithLabel <insertTrackerSchemaType>
                            fieldTitle="Type"
                            nameInSchema="trackertypeId"
                            data={type}
                        />
                        <InputTimeWithLabel <insertTrackerSchemaType>
                            fieldTitle="LeaveTime"
                            nameInSchema="leaveTime"
                        />
                        <div className="flex flex-col gap-4 w-full max-w-xs">
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
                    </div>

              
                </form>
            
            </Form>

        </div>

    )
}

