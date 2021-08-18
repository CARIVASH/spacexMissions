import { Input, Stack, InputGroup, Button } from "@chakra-ui/react"
import { SearchIcon } from '@chakra-ui/icons'
import React, {useCallback, useState} from "react";

export default function Home( {data} ) {
    //console.log(data);

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const OnChange = useCallback((event) => {
            const query = event.target.value;
            setQuery(query)
        },[]);
    
        console.log('query: ',query);
    return (
        <Stack width="100%" >
            <InputGroup flex="true" justifyContent="flex-end" paddingRight="15px">
                <Input 
                    width="250px" 
                    roundedLeft="4px" 
                    roundedTop="4px" 
                    roundedBottom="4px" 
                    padding="5px" 
                    background="gray.200" 
                    size="md" 
                    variant="flushed" 
                    placeholder="Search mission..." 
                    onChange={OnChange}
                />
                <Button padding="5px">
                <SearchIcon height="100%" position="absolute" />
                </Button>
            </InputGroup>
        </Stack>
    )
}
