// Components 
import CardExample from '../components/Card'

// UI Elements
import {
  Center,
  Grid,
  Button,
  Select,
  Container,
  Tooltip,
  Spinner,
  Box,
  useMediaQuery,
  Input,
  Stack,
  InputGroup,
  useDisclosure,
  SlideFade
} from "@chakra-ui/react"
import { DragHandleIcon, HamburgerIcon, SearchIcon, RepeatIcon } from '@chakra-ui/icons'

import { gql, useQuery } from "@apollo/client";

import React, { useCallback, useState, useEffect } from 'react';
import Head from 'next/head'

export const SEARCH_MISSIONS = gql`
    query launchesPast($find: LaunchFind, $limit: Int!) {
      launchesPast(find: $find, limit: $limit) {
        id
        mission_name
        details
        links {
          article_link
          flickr_images
          mission_patch_small
          video_link
        }
        rocket {
        rocket_name
            first_stage {
            cores {
              flight
              core {
                reuse_count
                status
              }
            }
          }
        }
        launch_date_utc
    }
    }
`;

export default function Home() {

  const [sm] = useMediaQuery("(max-width: 640px)");
  const [landscape] = useMediaQuery("(orientation: landscape)");
  const [viewStyle, setView] = useState("grid");
  const [query, setQuery] = useState('');
  const [inputName, setName] = useState('');
  const [limit, setLimit] = useState(10);
  const [scrollY, setScrollY] = useState(0);
  const [totalHeight, setHeight] = useState(0);
  const [tHeight, setTHeight] = useState(0);
  const [posScroll, setPos] = useState(0);

  useEffect(() => {

    const autoScroll = () => {
      const posY = Number((localStorage.getItem('posY')))
      setPos(posY);
      if (localStorage.getItem('posY')) {
        console.log("changeScroll", posScroll);
        window.scrollTo(0, posY);
        destroyFile();
      }
    }

    const destroyFile = () => {
      setTimeout(() => {
        localStorage.removeItem('posY');
      }, 2500);

    }

    const handleScroll = () => {
      setHeight(window.innerHeight);
      setTHeight(document.body.offsetHeight);
      setScrollY(window.scrollY);
    }

    handleScroll();
    autoScroll();

    window.addEventListener("scroll", handleScroll);
    window.onload = () => {
      const posY = Number((localStorage.getItem('posY')))
      setPos(posY);
      if (localStorage.getItem('posY')) {
        console.log("changeScroll", posScroll);
        window.scrollTo(0, posY);
        destroyFile();
      }
    };
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", autoScroll);
    };
  }, [posScroll]);

  if (viewStyle === "list" && sm && !landscape) {
    console.log('List');
    setView("grid");
  }else if(viewStyle === "grid" && sm && landscape){
    console.log('landscape');
    setView("list");
  }

  const OnChange = useCallback((event) => {
    const query = event.target.value;
    setQuery(query)
  }, []);

  const OnClick = () => {
    setName(query)
  }

  const ClearClick = () => {
    setName('')
    setQuery('')
  }

  const { isOpen, onToggle } = useDisclosure()

  //console.log('ScrollY-------->', scrollY);
  // console.log('total Height--------->', totalHeight);
  // console.log('tHeight--------->', tHeight);


  const { loading, error, data } = useQuery(SEARCH_MISSIONS, {
    variables: { find: { mission_name: inputName }, limit: limit }
  });

  if (loading)
    return (
      <Box width="100%" height="100vh" background="black" color="white" d="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <Box fontSize={{ lg: "9xl", base: "7xl" }} fontWeight="700" padding="15px">
          SpaceX
        </Box>
        <Spinner />
        <p>Loading Missions...</p>
      </Box>
    )

  if (error) return <p>`Error... ${error.message}`</p>
  const resultData = data.launchesPast;
  localStorage.setItem('dataResult', JSON.stringify(resultData));

  return (
    <Box>
      <Head>
        <title>SpaceX - {inputName ? inputName : "Missions"}</title>
      </Head>
      {
        !loading && (totalHeight + scrollY) >= (tHeight - 800) && totalHeight !== tHeight ?
          (
            setLimit(limit + 10),
            localStorage.setItem('posY', JSON.stringify(scrollY))
          )
          :
          null
      }
      <Grid templateRows="repeat(2, 1fr)" gap={6}>
        <Center h="50px" fontSize="50px" fontWeight="700">
          SpaceX
        </Center>
        <Box>
          <Stack width="100%">
            {inputName === "" ?
              <></>
              :
              <Box width="100%" display="flex" justifyContent={{ lg: "flex-start", md: "flex-star", base: "space-between" }} position={{ lg: "absolute", md: "absolute", base: "relative" }} padding={{ lg: "10px", base: "8px" }} fontSize="25px">
                Result(s): ´{inputName}´
                <Button onClick={ClearClick}>Clear Search</Button>
              </Box>
            }
            <InputGroup flex="true" justifyContent="flex-end" paddingRight="15px">
              <SlideFade in={isOpen} offsetX="50px" offsetY="0px">
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
              </SlideFade>
              {
                query === ""
                  ?
                  <Button padding="5px" onClick={onToggle}>
                    <SearchIcon height="100%" position="absolute" />
                  </Button>
                  :
                  <Button padding="5px" onClick={OnClick}>
                    <SearchIcon height="100%" position="absolute" />
                  </Button>
              }

            </InputGroup>
          </Stack>
        </Box>
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap={2}>
        <div>
          {
            !sm ?
              <>
                <Tooltip label="Grid" fontSize="md" placement="top">
                  <Button marginLeft="15px" onClick={() => setView("grid")}>
                    <DragHandleIcon></DragHandleIcon>
                  </Button>
                </Tooltip>
                <Tooltip label="List" fontSize="md" placement="top">
                  <Button marginLeft="10px" onClick={() => setView("list")}>
                    <HamburgerIcon></HamburgerIcon>
                  </Button>
                </Tooltip>
              </>
              :
              null
          }
        </div>
        {/* <Container marginRight="0px" maxW="container.sm">
          <Select variant="flushed" width="200px" float="right" placeholder="Sort By...">
            <option value="option1">Date</option>
            <option value="option2">Flights</option>
            <option value="option3">Option 3</option>
          </Select>
        </Container> */}
      </Grid>
      {
        viewStyle === "grid" && !sm ?
          <Grid templateColumns={{ lg: "repeat(4, 1fr)", md: "repeat(2, 1fr)", base: "repeat(1, 1fr)" }} gap={6} padding="15px">
            {resultData.length !== 0
              ?
              resultData.map((res: any) => {
                return (
                  <CardExample key={res.id} data={res} view={viewStyle} />
                )
              })
              :
              <>
                <Box width="100%" fontSize="25px" fontWeight="700" paddingTop="35px">
                  <Box width="100%" textAlign="center">
                    No Results to: ´{inputName}´
                  </Box>
                  <Button width="100%" onClick={ClearClick}>
                    <RepeatIcon />
                    Reload Search...
                  </Button>
                </Box>
                <div></div>
                <div></div>

              </>
            }
          </Grid>
          :
          <Grid templateColumns={{ lg: "repeat(1, 1fr)", md: "repeat(1, 1fr)", base: "repeat(1, 1fr)" }} gap={6} padding="15px">
            {resultData.length !== 0
              ?
              resultData.map((res: any) => {
                return (
                  <CardExample key={res.id} data={res} view={viewStyle} />
                )
              })
              :
              <span>No results</span>
            }
          </Grid>
      }
    </Box>
  )
}
