import Input from '@mui/joy/Input';
import { ChangeEvent } from 'react';
export default function InputForm({placeholder,onChange, type}:{placeholder:string,onChange:(event: ChangeEvent<HTMLInputElement>) => void,type:string})
{
    return (
        <Input required variant='soft' placeholder={placeholder} type={type} className="w-full border border-blue-100 rounded-sm" onChange={onChange} ></Input>
    )
}