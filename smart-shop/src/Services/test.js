import { createClient } from '@supabase/supabase-js'

console.log('test')



const supabase = createClient('https://witfgtulzcffsypunzcl.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpdGZndHVsemNmZnN5cHVuemNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzYxMDU2MDYsImV4cCI6MTk5MTY4MTYwNn0.fv3dnu05a9wbgoo3cc8NzTOtBt-1RUCVvEbUOFEgE9c')


async function getSessions() {
    console.log('getting sessions')
    const session = await supabase.from('Page').select()
    console.log(session)
    //console.log(error)
    
  }
  
getSessions()