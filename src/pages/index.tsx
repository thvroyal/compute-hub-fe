import Hero from 'components/Hero'
import Container from 'components/Container'
import DarkModeSwitch from 'components/DarkModeSwitch'
import { useEffect } from 'react'
import { useRouter } from 'next/dist/client/router'

const Index = () => {
  const router = useRouter()

  useEffect(() => {
    router.push('/projects/create')
  }, [router])
  return (
    <Container height="100vh">
      <DarkModeSwitch />

      <Hero />
    </Container>
  )
}

export default Index
