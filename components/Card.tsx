import {
    Box,
    Image,
    Badge,
    AspectRatio,
    Button,
    Skeleton,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton
} from "@chakra-ui/react"
import { SpinnerIcon, LinkIcon } from '@chakra-ui/icons'
import Link from 'next/link'
import { values } from "lodash";
import React, { useState } from "react";


function CardExample({ data, view }) {

    const formatDate = new Date(data.launch_date_utc).toString();

    const property = {
        arrImages: data.links.mission_patch_small,
        date: formatDate.split(" "),
        rocket: data.rocket.rocket_name,
        rocketType: data.rocket.__typename,
        flights: data.rocket.first_stage.cores[0].flight,
        articleLink: data.links.article_link,
        details: data.details,
        video: data.links.video_link
    }

    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isVideoOpen, onOpen: onVideoOpen, onClose: onVideoClose } = useDisclosure()

    return (
        <>
            {
                view === "grid" ?
                    <Box width="100%" boxShadow="md" height="600px" maxW="sm" borderWidth="1px" borderRadius="lg" overflowY="hidden">
                        {/* Info Card Modal */}
                        {
                            isOpen
                                ?
                                <Modal isOpen={isOpen} onClose={onClose}>
                                    <ModalOverlay />
                                    <ModalContent>
                                        <ModalHeader>{data.mission_name}</ModalHeader>
                                        <ModalCloseButton colorScheme="red" />
                                        {property.articleLink !== null && property.details !== null ?
                                            <Box padding="8px">
                                                {property.details}
                                                <ModalBody fontSize="md" textColor="blue" padding="0px">
                                                    <Link href={property.articleLink} >
                                                        <a target="_blank">Read the whole article...</a>
                                                    </Link>
                                                </ModalBody>
                                            </Box>
                                            :
                                            <ModalBody padding="8px">
                                                <Box>
                                                    Sorry! We don´t find information about this mission.
                                                </Box>
                                                <Box d="flex">
                                                    You can find many articles
                                                    <ModalBody fontSize="md" textColor="blue" padding="0px">
                                                        <Link href="https://spaceflightnow.com/">
                                                            <a target="_blank">here...</a>
                                                        </Link>
                                                    </ModalBody>
                                                </Box>
                                            </ModalBody>
                                        }

                                        <ModalFooter>
                                            <Button colorScheme="pink" mr={3} onClick={onClose}>
                                                Close
                                            </Button>
                                            <Button variant="ghost" onClick={onVideoOpen}>Watch Video</Button>
                                        </ModalFooter>
                                    </ModalContent>
                                </Modal>
                                :
                                null
                        }
                        {/* Video Modal */}
                        {
                            isVideoOpen
                                ?
                                <Modal isOpen={isVideoOpen} onClose={onVideoClose}>
                                    <ModalOverlay />
                                    <ModalContent>
                                        <ModalHeader>{data.mission_name}</ModalHeader>
                                        <ModalCloseButton colorScheme="red" />
                                        {property.video !== null ?
                                            <Box padding="8px">
                                                <ModalBody fontSize="md" textColor="blue" padding="0px">
                                                    <AspectRatio maxW="560px" ratio={2}>
                                                        <iframe
                                                            title="SpaceX"
                                                            src={property.video}
                                                            allowFullScreen
                                                        />
                                                    </AspectRatio>
                                                    <Box textColor="black" fontSize="sm" width="100%" textAlign="center">
                                                        If you can´t see the video you can click on the button to redirect                                        </Box>
                                                </ModalBody>
                                            </Box>
                                            :
                                            <ModalBody padding="8px">
                                                <Box>
                                                    Sorry! We don´t find information about this mission.
                                                </Box>
                                                <Box d="flex">
                                                    You can find many articles
                                                    <ModalBody fontSize="md" textColor="blue" padding="0px">
                                                        <Link href="https://spaceflightnow.com/">
                                                            <a target="_blank">here...</a>
                                                        </Link>
                                                    </ModalBody>
                                                </Box>
                                            </ModalBody>
                                        }

                                        <ModalFooter>
                                            <Box width="100%" d="flex" justifyContent="space-between">
                                                <Link href={property.video}>
                                                    <a target="_blank">
                                                        <Button colorScheme="blue" mr={3}>
                                                            Watch Video
                                                        </Button>
                                                    </a>
                                                </Link>
                                                <Button mr={3} onClick={onVideoClose}>
                                                    Close
                                                </Button>
                                            </Box>
                                        </ModalFooter>
                                    </ModalContent>
                                </Modal>
                                :
                                null
                        }
                        {
                            data
                                ?
                                <AspectRatio ratio={1}>
                                    <Image position="relative" height="50%" src={data.links?.flickr_images.length !== 0 ? data.links.flickr_images[0] : property.arrImages} alt={data.title} />
                                </AspectRatio>
                                :
                                <Skeleton isLoaded={!data}>
                                </Skeleton>
                        }
                        <Box p="6">
                            <Box d="flex" alignItems="baseline">
                                Launch Date:
                                <Badge borderRadius="full" px="2" colorScheme="teal">
                                    {property.date[1]} {property.date[2]} {property.date[3]}
                                </Badge>
                            </Box>

                            <Box
                                mt="1"
                                fontWeight="semibold"
                                as="h4"
                                lineHeight="tight"
                                isTruncated
                                paddingY="16px"
                            >
                                Mission: {data.mission_name}
                            </Box>

                            <Box paddingY="8px">
                                Rocket:
                                {property.rocket}
                                <Box as="span" color="gray.600" fontSize="sm">
                                    ({property.rocketType})
                                </Box>
                            </Box>

                            <Box d="flex" mt="2" alignItems="center">
                                {Array(property.flights)
                                    .fill("")
                                    .map((_, i) => (
                                        <SpinnerIcon
                                            key={i}
                                            color={"teal.500"}
                                        />
                                    ))}
                                {property.flights > 2
                                    ?
                                    <Box as="span" ml="2" color="gray.600" fontSize="sm">
                                        {property.flights} Flights
                                    </Box>
                                    :
                                    <Box as="span" ml="2" color="gray.600" fontSize="sm">
                                        {property.flights} Flight
                                    </Box>
                                }
                            </Box>
                            <Box paddingY="16px" d="flex" width="100%" justifyContent="space-between">
                                {property.video !== null ?
                                    <Button
                                        onClick={onVideoOpen}
                                    >
                                        Watch Video
                                    </Button> :
                                    <Button disabled={true}>
                                        Watch Video
                                    </Button>
                                }

                                <Button
                                    onClick={onOpen}
                                    background="pink.400" textColor="white" _hover={{ bg: "pink.200" }} _active={{ bg: "pink.600" }} _focus={{ outline: "none" }}>
                                    More Info
                                </Button>
                            </Box>

                        </Box>
                    </Box>
                    :
                    <Box d="flex" width="100%" boxShadow="md" height="250px" borderWidth="1px" borderRadius="lg" overflowY="auto">
                        {/* Info Card Modal */}
                        {
                            isOpen
                                ?
                                <Modal isOpen={isOpen} onClose={onClose}>
                                    <ModalOverlay />
                                    <ModalContent>
                                        <ModalHeader>{data.mission_name}</ModalHeader>
                                        <ModalCloseButton colorScheme="red" />
                                        {property.articleLink !== null && property.details !== null ?
                                            <Box padding="8px">
                                                {property.details}
                                                <ModalBody fontSize="md" textColor="blue" padding="0px">
                                                    <Link href={property.articleLink} >
                                                        <a target="_blank">Read the whole article...</a>
                                                    </Link>
                                                </ModalBody>
                                            </Box>
                                            :
                                            <ModalBody padding="8px">
                                                <Box>
                                                    Sorry! We don´t find information about this mission.
                                                </Box>
                                                <Box d="flex">
                                                    You can find many articles
                                                    <ModalBody fontSize="md" textColor="blue" padding="0px">
                                                        <Link href="https://spaceflightnow.com/">
                                                            <a target="_blank">here...</a>
                                                        </Link>
                                                    </ModalBody>
                                                </Box>
                                            </ModalBody>
                                        }

                                        <ModalFooter>
                                            <Button colorScheme="pink" mr={3} onClick={onClose}>
                                                Close
                                            </Button>
                                            <Button variant="ghost" onClick={onVideoOpen}>Watch Video</Button>
                                        </ModalFooter>
                                    </ModalContent>
                                </Modal>
                                :
                                null
                        }
                        {/* Video Modal */}
                        {
                            isVideoOpen
                                ?
                                <Modal isOpen={isVideoOpen} onClose={onVideoClose}>
                                    <ModalOverlay />
                                    <ModalContent>
                                        <ModalHeader>{data.mission_name}</ModalHeader>
                                        <ModalCloseButton colorScheme="red" />
                                        {property.video !== null ?
                                            <Box padding="8px">
                                                <ModalBody fontSize="md" textColor="blue" padding="0px">
                                                    <AspectRatio maxW="560px" ratio={2}>
                                                        <iframe
                                                            title="SpaceX"
                                                            src={property.video}
                                                            allowFullScreen
                                                        />
                                                    </AspectRatio>
                                                    <Box textColor="black" fontSize="sm" width="100%" textAlign="center">
                                                        If you can´t see the video you can click on the button to redirect                                        </Box>
                                                </ModalBody>
                                            </Box>
                                            :
                                            <ModalBody padding="8px">
                                                <Box>
                                                    Sorry! We don´t find information about this mission.
                                                </Box>
                                                <Box d="flex">
                                                    You can find many articles
                                                    <ModalBody fontSize="md" textColor="blue" padding="0px">
                                                        <Link href="https://spaceflightnow.com/">
                                                            <a target="_blank">here...</a>
                                                        </Link>
                                                    </ModalBody>
                                                </Box>
                                            </ModalBody>
                                        }

                                        <ModalFooter>
                                            <Box width="100%" d="flex" justifyContent="space-between">
                                                <Link href={property.video}>
                                                    <a target="_blank">
                                                        <Button colorScheme="blue" mr={3}>
                                                            Watch Video
                                                        </Button>
                                                    </a>
                                                </Link>
                                                <Button mr={3} onClick={onVideoClose}>
                                                    Close
                                                </Button>
                                            </Box>
                                        </ModalFooter>
                                    </ModalContent>
                                </Modal>
                                :
                                null
                        }
                        {
                            data
                                ?
                                <Image height="auto" src={data.links?.flickr_images.length !== 0 ? data.links.flickr_images[0] : property.arrImages} alt={data.title} />
                                :
                                <Skeleton isLoaded={!data}>
                                </Skeleton>
                        }
                        <Box p="6" width="100%" height="auto" d="flex" flexDirection="column">

                            <Box d="flex" alignItems="center" justifyContent="space-between">
                                <Box
                                    mt="1"
                                    fontWeight="semibold"
                                    as="h2"
                                    lineHeight="tight"
                                    isTruncated
                                    paddingY="8px"
                                >
                                    Mission: {data.mission_name}
                                </Box>

                                <Box 
                                    mt="1"
                                    fontWeight="semibold"
                                    as="h2"
                                    lineHeight="tight"
                                    isTruncated
                                    paddingY="8px"
                                >
                                    Launch Date:
                                    <Badge borderRadius="full" px="2" colorScheme="teal">
                                        {property.date[1]} {property.date[2]} {property.date[3]}
                                    </Badge>
                                </Box>
                            </Box>

                            <Box paddingY="16px">
                            <Box >
                                Rocket: 
                                {property.rocket}
                                <Box as="span" color="gray.600" fontSize="sm">
                                    ({property.rocketType})
                                </Box>
                            </Box>
                            <Box >
                                Description: 
                                <Box as="span" color="gray.600" fontSize="sm">
                                    {property.details ? property.details : "No description founded."}
                                </Box>
                            </Box>
                            </Box>
                            

                            <Box width="100%" d="flex" justifyContent="flex-end" mt="2" alignItems="center">
                                <Box>
                                    {Array(property.flights)
                                        .fill("")
                                        .map((_, i) => (
                                            <SpinnerIcon
                                                key={i}
                                                color={"teal.500"}
                                            />
                                        ))}
                                </Box>
                                {property.flights > 2
                                    ?
                                    <Box as="span" ml="2" color="gray.600" fontSize="sm">
                                        {property.flights} Flights
                                    </Box>
                                    :
                                    <Box as="span" ml="2" color="gray.600" fontSize="sm">
                                        {property.flights} Flight
                                    </Box>
                                }
                            </Box>
                            <Box paddingY="16px" d="flex" width="100%" justifyContent="space-between">
                                {property.video !== null ?
                                    <Button
                                        onClick={onVideoOpen}
                                    >
                                        Watch Video
                                    </Button> :
                                    <Button disabled={true}>
                                        Watch Video
                                    </Button>
                                }

                                <Button
                                    onClick={onOpen}
                                    background="pink.400" textColor="white" _hover={{ bg: "pink.200" }} _active={{ bg: "pink.600" }} _focus={{ outline: "none" }}>
                                    More Info
                                </Button>
                            </Box>

                        </Box>
                    </Box>
            }
        </>
    )
}

export default CardExample;