from config.constant import DEVELOPMENT_MODE

class GlobalMode:
    __instance = None
    @staticmethod
    def getInstance():
        if GlobalMode.__instance is None:
            return GlobalMode()
        return GlobalMode.__instance
    def __init__(self):
        self.mode = DEVELOPMENT_MODE
        if GlobalMode.__instance is not None:
            raise Exception("Instantiation is restricted")
        else:
            GlobalMode.__instance = self