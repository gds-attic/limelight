class FcoController < ApplicationController

  def pay_legalisation_post
    @transaction_title = 'Pay to get documents legalised by post'
    @transaction_slug = 'pay-legalisation-post'
    @explanatory_copy = "Service to pay the Foreign & Commonwealth Office (FCO) to get a UK public document 'legalised' - this means a signature, seal or stamp made by a UK public official on the document is confirmed as genuine by the UK government. Figures on this page include only applications processed on GOV.UK."
    render_index
  end
  
  def pay_legalisation_drop_off
    @transaction_title = 'Pay to legalise documents using the premium service'
    @transaction_slug = 'pay-legalisation-drop-off'
    @explanatory_copy = "Service to pay the Foreign & Commonwealth Office (FCO) to get a UK public document 'legalised' - this means a signature, seal or stamp made by a UK public official on the document is confirmed as genuine by the UK government. This premium service is only available for registered businesses. Figures on this page include only applications processed on GOV.UK."
    render_index
  end
  
  def pay_register_birth_abroad
    @transaction_title = 'Payment to register a birth abroad in the UK'
    @transaction_slug = 'pay-register-birth-abroad'
    @explanatory_copy = "Service to pay the Foreign & Commonwealth Office (FCO) if you're eligible to register the birth of a British national abroad. Figures on this page include only applications processed in the UK on GOV.UK."
    render_index
  end
  
  def pay_register_death_abroad
    @transaction_title = 'Payment to register a death abroad'
    @transaction_slug = 'pay-register-death-abroad'
    @explanatory_copy = "Service to pay the Foreign & Commonwealth Office (FCO) if you register the death of a British national abroad. Figures on this page include only applications processed in the UK on GOV.UK."
    render_index
  end
  
  def pay_foreign_marriage_certificates
    @transaction_title = 'Payment for certificates to get married abroad'
    @transaction_slug = 'pay-foreign-marriage-certificates'
    @explanatory_copy = "Service to pay the Foreign & Commonwealth Office (FCO) for documents you need to get married abroad. Figures on this page include only applications processed in the UK on GOV.UK."
    render_index
  end
  
  def deposit_foreign_marriage
    @transaction_title = 'Deposit foreign marriage or civil partnership certificates'
    @transaction_slug = 'deposit-foreign-marriage'
    @explanatory_copy = "Service to pay the Foreign & Commonwealth Office (FCO) to deposit a foreign marriage or civil partnership certificate at the General Registry Office. Figures on this page include only applications processed in the UK on GOV.UK."
    render_index
  end

  private

  def render_index
    respond_to do |format|
        format.html { render :template => "fco/index" }
    end
  end

end
