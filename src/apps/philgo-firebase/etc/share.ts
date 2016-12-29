export interface FORM_PROCESS {
    loader?: boolean;
    error?: string;
    success?: string;
    reset(): FORM_PROCESS ;
    startLoader(): FORM_PROCESS ;
    begin(): FORM_PROCESS;
    stopLoader(): FORM_PROCESS ;
    setError( message: string ) : FORM_PROCESS;
    setSuccess( message: string ) : FORM_PROCESS;
};

export let formProcess: FORM_PROCESS = {
    loader: false,
    error: '',
    success: '',
    reset: function() : FORM_PROCESS {
        this.loader = false;
        this.error = '';
        this.success = '';
        return this;
    },
    startLoader: function () : FORM_PROCESS {
        this.loader = true;
        this.error = '';
        this.success = '';
        return this;
    },
    begin: function() : FORM_PROCESS {
        return this.startLoader();
    },
    stopLoader: function() : FORM_PROCESS {
        this.loader = false;
        return this;
    },

    setError: function ( message: string ) : FORM_PROCESS {
        this.loader = false;
        this.success = null;
        this.error = message;
        return this;
    },

    setSuccess: function ( message: string ) : FORM_PROCESS {
        this.loader = false;
        this.success = message;
        this.error = null;
        return this;
    }

};
