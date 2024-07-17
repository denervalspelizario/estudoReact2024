import { useState, useEffect, useRef, useMemo, useCallback } from "react" // useMemo é uma função no React que permite otimizar o desempenho de componentes, memorizando valores calculados
/*
  O hook useCallback é usado no React para memorizar uma versão "memoizada" de uma função. Ele é útil quando você precisa passar funções para componentes filho, 
  garantindo que essas funções não sejam recriadas a cada renderização do componente pai, a menos que suas dependências tenham sido alteradas.

*/

export default function App(){

  const inputRef = useRef<HTMLInputElement>(null) // se inicia como vazio - como estmaos usando typescript temos que referenciar
  const firstRender = useRef(true);
  const [ input, setInput] = useState('')
  const [ tasks, setTasks] = useState<string[]>([]) // state que é uma array de string lembre-se string[] estou tipando como array de string



  const [editTask, setEditTask] = useState({ // state que é um array
    
    enable: false, // dado que vai indicar se vai editar ou não estando true sinaliza uma edicao 
    task: '' // tarefa que inicia vazia
  
  })

  
  // funcao executada quando inicia
  useEffect(() => {
    const tarefasSalvas = localStorage.getItem('@cursoreact') // estou salvando os dados salvos(as tarefas) na variavel tarefasSalvas

    if(tarefasSalvas){ // se tiver alguma coisa em tarefasSalvas então

      setTasks(JSON.parse(tarefasSalvas))  // adicono essas tarefas salvas na state tasks
                                           // lembrando que elas foram slavas como strang então agora eu tenho que tranforma-las em array usando o JSON.parse  
    }

  }, [])


  // funcao executada quando altera a tarefa ou seja toda vez que adicionar uma tarefa ou editar essa funcao será chamada
  useEffect(()=> {

    if(firstRender.current){ // se fisrtRender estiver true ou seja é aprimeira vez que ta abrindo o componente

      firstRender.current = false; // trnasforma em false para evitar a primeira renderizada
      return

    }

    localStorage.setItem('@cursoreact', JSON.stringify(tasks))
    /* atravez do localStorage estamos salvando todas as tarefas na state item para que eles ficam slavam mesmo que de f5 na pagina
       @cursoreact é a chave desse localstorage
       localstorage só salva em string e como tasks estao como array usamos JSON.stringify para tranformar elas em string
       lembrando que ...tasks são todas as tarefas 
    */

  },[tasks]) // toda vez que a state tasks mudar



  const handleRegister = useCallback(() => {

    if(!input){ // se input estiver false ou seja nda foi adicionado a ele então
      alert("Preencha todos os dados") // de o alerta
      return // return para parar a execução
    }

    if(editTask.enable){ // se enable estiver true siginifica que esta editando uma task
      
      handleSaveEdit(); // então chama a funcao para editar o edit
      return
    } 

    setTasks(tarefas => [...tarefas, input]) // estou pegando atravez do spread operator(...tarefas) todos os dados que já tem e adicionando mais uma tarefa 
                                             // ou seja ...tarefas(tarefas antigas) + input(tarefa adicionada) e jogando em tarefas e depois na state tasks
                                             // no final tasks vai ter tarefas antigas + a nova tarefa 

    setInput('') // zerando input após adicionar a tarefa      
    

  }, [input, tasks]) // quanto input OU tasks mudarem valor handleRegister será chamadasemples assim


  /* FUNCAO DE REGISTRAR UMA TAREFA  observar esta funcao funciona mas foi desativada para uso de callback acima
  function handleRegister(){
    
    if(!input){ // se input estiver false ou seja nda foi adicionado a ele então
      alert("Preencha todos os dados") // de o alerta
      return // return para parar a execução
    }

    if(editTask.enable){ // se enable estiver true siginifica que esta editando uma task
      
      handleSaveEdit(); // então chama a funcao para editar o edit
      return
    } 

    setTasks(tarefas => [...tarefas, input]) // estou pegando atravez do spread operator(...tarefas) todos os dados que já tem e adicionando mais uma tarefa 
                                             // ou seja ...tarefas(tarefas antigas) + input(tarefa adicionada) e jogando em tarefas e depois na state tasks
                                             // no final tasks vai ter tarefas antigas + a nova tarefa 

    setInput('') // zerando input após adicionar a tarefa      
    
   
    
  }*/



  // FUNCAO DELETANDO UMA TAREFA
  function handleDelete(item: string){
    
    const removeTask = tasks.filter( task => task !== item) // filter vai percorrer os dados de task e retornar todas as task MENOS
                                                            // o item do parametro no caso o item clicado

    setTasks(removeTask) //depois que removeTask recebe todos os dados MENOS o dado cliclado 
                         // então state task recebe removeTask        
                         
                        
  }

  // FUNCAO EDITAR TAREFA
  function handleEdit(item: string){

    inputRef.current?.focus() //quando usuario clicar la no btn edit que chama essa funcao o input sera dado focu
    
    setInput(item) // clicou la no btn adiciona o item no input
    
    setEditTask({
      enable: true, // sinalizando que estamos editando
      task: item   // tasks recebe o item que foi clicado
    })
                                                          
  }

  function handleSaveEdit(){
    
    const findIndexTask = tasks.findIndex(task => task === editTask.task) // jogando em find a posicao do item que sera editado
                                                                          // tasks.findIndex = ou seja usando a funcao nativa do js para encontra posicao  na state tasks   
                                                                          // task === editTask.task = indicar a mesma task da state task e da editTask 

    const allTasks = [...tasks] // joguei a state tasks na variavel

    allTasks[findIndexTask] = input // joguei o dado do input NA POSIÇÂO  do item que sera editado

    setTasks(allTasks)

    /* RESUMINDO O CODIGO  
      1 - ENCONTRO A POSICAO DO ITEM QUE SERA EDITADO ATRAVEZ DO FINDiNDEX  
      2 - JOGO A ARRAY COM TODOS OS DADOS EM 1 CONSTANTE
      3 - JOGO O DADO DO INPUT(DADO QUE EU EDITEI) NA MESMA POSICAO DO DADO QUE EU ESCOLHI EDITAR 
      4 - E DEPOIS JOGO ESSA CONSTANTE JA COM OS DADOS ATUALIZADO NA STATE TASK  
       
    */
    setEditTask({
      
      enable: false, 
      task: '' 
      
    })

    setInput('') // limpando o input                        
  }             

  // FUNCAO COM A QTD DE TAREFAS DENTRO DA STATE TASKS
  const totalTarefas = useMemo(() => {

    return tasks.length // retornando apenas aquantidade tarefas na state tasks

  }, [tasks]) // ou seja toda vez que alterar a state tasks a const totalTarefas será chamada e atualizara qtd de tarefas



  
  return(
    <div>
      <h1>Lista de Tarefas</h1>
      <input 
        placeholder="Digite o nome da tarefa"  
        value={input}  // input recebe valor de state input
        onChange={(event) => setInput(event.target.value)} // dados digitados no input serão adicionados no state input
        ref={inputRef} // estou referenciando este input
      />
      <button onClick={handleRegister}>
        {editTask.enable ? 'Atualizar tarefa' : 'Adicionar tarefa'} 
      </button>
      
      <hr />

      <strong>Você tem {totalTarefas} tarefas!</strong>
      <br />
      <br />

      {tasks.map((item, index) => ( // map faz percorrer todos os dados de task
                                    // item é o dado e index é a posicao 
                                    // ou seja percorre todos os dados em todas posições neste caso vai fazer 3 section com cada item
        <section key={item}>
          <span>{item}</span>
          
          <button 
            onClick={() => handleEdit(item) // a funcão handle delete esta dentro de um funcao anonima para que se execute somente ao clicar
                                              // se adicionar parametro nessa funcao sem ser anonima ela vai ficar em loop executando 
          }>
            Editar
          </button>

          <button 
            onClick={() => handleDelete(item) // a funcão handle delete esta dentro de um funcao anonima para que se execute somente ao clicar
                                              // se adicionar parametro nessa funcao sem ser anonima ela vai ficar em loop executando 
          }>
            Excluir
          </button>
        </section>

      ) )}
    </div>
  )
}


