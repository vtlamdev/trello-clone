import TrelloImage from "/trello-logo.gif"
export default function TrelloImageLogo()
{
    return <img className='w-24 bg-black filter invert' src={TrelloImage} alt="Trello logo" />
}