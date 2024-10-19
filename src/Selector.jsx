import { DecodeWindow } from "./DecodeWindow"
import { EncodeWindow } from "./EncodeWindow"

export const AppSelector = ({current})=>{

    return(
        <dev>
        {current === 'encode':<EncodeWindow/>?null}
        </dev>
    )
}